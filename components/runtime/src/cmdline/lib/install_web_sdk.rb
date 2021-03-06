#
# Copyright 2006-2008 Appcelerator, Inc.
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#    http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License. 


require 'fileutils'

module Appcelerator
  class Installer

    def Installer.install_websdk(project,tx,update=false,sdk=nil)

      if sdk.nil?
        sdk = Installer.require_component(:websdk, 'websdk', nil,
                                          :tx=>tx, :force=>update,
                                          :quiet_if_installed=>true)
      end
      die "Couldn't find a version of the websdk to install" unless sdk

      # project needs to know websdk version
      # to decide where the websdk path is
      web_version = sdk[:version]
      project.config[:websdk] = web_version
      old_style_websdk = web_version.split('.')[0].to_i < 3

      # make web folder directories
      sdk_path = project.get_websdk_path()
      FileUtils.mkdir_p sdk_path unless File.exists? sdk_path

      paths = %w(images stylesheets swf)
      found_count = 0
      paths.each do |path|
        path = project.get_websdk_path(path)
        found_count +=1 if File.exists? path
        FileUtils.mkdir_p path unless File.exists? path
      end

      # we already have an SDK installed, don't overwrite unless force
      return nil if found_count==paths.length and !(OPTIONS[:force] or OPTIONS[:force_update])

      source_dir = Installer.get_component_directory(sdk)

      project.config[:widgets] = []

      puts "Using websdk #{web_version}" unless OPTIONS[:quiet]

      if OPTIONS[:verbose]
        path = project.get_web_path('.')
        if update
          puts "Updating to websdk version #{sdk[:version]} at #{path}"
        else
          puts "Installing websdk version #{sdk[:version]} at #{path}"
        end
      end

      event = {:project=>project,
               :source_dir=>source_dir,
               :version=>web_version,
               :tx=>tx}

      PluginManager.dispatchEvents('copy_web',event) do

        # TODO: make web directories configurable
        Installer.copy(tx, "#{source_dir}/build.yml", project.get_path(:web))

        if not old_style_websdk
            Installer.copy(tx, "#{source_dir}/javascripts/.", project.get_websdk_path())
        else
            Installer.copy(tx, "#{source_dir}/javascripts/.", project.get_websdk_path("javascripts"))
        end

        Installer.copy(tx, "#{source_dir}/swf/.", project.get_websdk_path("swf"))
        Installer.copy(tx, "#{source_dir}/common/.", project.get_websdk_path("common"))
        Installer.copy(tx, "#{source_dir}/components/.", project.get_websdk_path("components"))

        add_thing_options = {
          :quiet=>true,
          :quiet_if_installed=>true,
          :tx=>tx,
          :ignore_path_check=>true,
          :no_save=>false,
          :verbose=>false,
          :force_overwrite=>true,
          :project=>project
        }

        unless OPTIONS[:minimal]

          print 'Installing components (this may take a few seconds)...' unless OPTIONS[:quiet]
          $stdout.flush()
  
          cur_quiet = OPTIONS[:quiet]
          OPTIONS[:quiet] = true
          count = 0

          # include any bundled components automagically
          Dir["#{source_dir}/_install/*.zip"].each do |filename|
            type = File.basename(filename).split(/[-,_]/)
            next unless type.length > 0
            type = type.first

            # only install new components
            if (compare_with_local(filename) > 0)
                CommandRegistry.execute("install:#{type}",[filename],add_thing_options)
            end
            CommandRegistry.execute("add:#{type}",[filename,project.path],add_thing_options)

            count+=1
          end

          OPTIONS[:quiet] = cur_quiet
          printf "#{count} components installed\n" unless OPTIONS[:quiet]
        end

        if not update

          if not old_style_websdk
            Installer.copy(tx, "#{source_dir}/appcelerator/images/.", project.get_websdk_path("images"))
          else
            Installer.copy(tx, "#{source_dir}/images/.", project.get_websdk_path("images"))
          end

          Installer.copy(tx, Dir.glob("#{source_dir}/*.html"), project.get_path(:web))

          widgets = Installer.find_dependencies_for(sdk) || []
          widgets = widgets.reject{|d| d[:type] != 'widget'}

          # install our widgets
          widgets.each do |widget|
            add_widget_options = {
              :version=>widget[:version],
              :quiet=>true,
              :quiet_if_installed=>true,
              :tx=>tx,
              :ignore_path_check=>true,
              :no_save=>true,
              :project=>project
            }
            CommandRegistry.execute('add:widget',[widget[:name],project.path],add_widget_options)
          end

        end
        project.save_config()

      end

    end


  end
end


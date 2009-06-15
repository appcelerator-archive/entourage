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


include Appcelerator
CommandRegistry.registerCommand(%w(install:updates install:update),'attempt to update installed components') do |args,options|
  
  puts "Checking for updates..." unless OPTIONS[:quiet]
  Installer.selfupdate
  
  list = Installer.fetch_distribution_list
  possible_updates = 0

  # get all installed components
  installed_components = []
  Installer.with_site_config(false) do |site_config|
    installed = site_config[:installed] || {}
    installed.keys.each do |type|
      entries = installed[type] || []
      entries.each do |entry|
        comp = {:type=>entry[:type], :name=>entry[:name]}
        installed_components << comp unless installed.include?(comp)
      end
    end
  end

  installed_components.each do |info|
    installed = Installer.get_current_installed_component(info)
    type = installed[:type]
    name = installed[:name]
    version = installed[:version]
    checksum = installed[:checksum]

    remote = Installer.get_current_remote_component({:type => type, :name => name})
    rem_version = remote[:version]
    rem_checksum = remote[:checksum]

    if OPTIONS[:debug]
      puts "----"
      puts "local_entry=#{installed.inspect}"
      puts "remote_entry=#{remote.inspect}"
    end

    update = Installer.should_update(version, rem_version, checksum, rem_checksum)
    puts "Should updated? #{update}" if OPTIONS[:debug]

    if update and not Installer.installed_this_session?(remote)

      possible_updates += 1
      if confirm_yes("Update #{type} '#{name}' from #{version} to #{rem_version} ? [Yna]")

        # We would use Installer.require_component here, but it doesn't
        # take into account checksum differences. So we do it manually.
        # The next step is to rewrite require_component.
        icomp = Installer.install_from_devnetwork(remote)
        Installer.finish_install(icomp)
      end
    end
  end

  if possible_updates == 0
    puts "No updates found. You're completely up-to-date." unless OPTIONS[:quiet]
  end

end

#
#
# This file is part of Appcelerator.
#
# Copyright 2006-2008 Appcelerator, Inc.
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.
#

desc "Build the Spring Service"
task :spring do

  spring_service_dir = File.expand_path(File.dirname(__FILE__))
  build_dir = File.expand_path(File.join(File.dirname(__FILE__),'../','java'))
  build_config = get_config(:service, :spring)

  require File.join(build_dir, "../common", "common.rb")
  require File.join(build_dir, "common.rb")

  version = build_config[:version]
  java_dir = File.expand_path "#{STAGE_DIR}/spring"
  java_classes = File.expand_path "#{java_dir}/classes"
  java_source = File.expand_path "#{build_dir}/src"

  clean_dir(java_dir)

  FileUtils.mkdir_p(java_classes)
  FileUtils.mkdir_p(File.join(java_dir,'dist')) rescue nil
  FileUtils.mkdir_p(File.join(java_dir,'dist','lib')) rescue nil

  copy_dir "#{build_dir}/pieces", File.join(java_dir,'dist/pieces')
  copy_dir "#{spring_service_dir}/pieces", File.join(java_dir,'dist/pieces')
  FileUtils.cp("#{build_dir}/install.rb", File.join(java_dir, 'dist'))
  
  install_file = File.join(java_dir, 'dist', 'install.rb')
  install = File.read(install_file)
  install.gsub! 'class Java', 'class Spring'
  install.gsub! "MODULE_TYPE_NAME='Java'", "MODULE_TYPE_NAME='Spring'"
  
  f = File.open install_file,'w'
  f.puts install
  f.close

# todo move this to common with java somehow    
# warning-aco if you screw up the spaces here, you will pay in silent errors!!!
  AGENT_MF=<<-END
Premain-Class: org.appcelerator.agent.SimpleInstrumentor
Can-Redefine-Classes: true
  END
# end warning-aco

  SPRING_WEBXML=<<-END
    <context-param>
      <param-name>contextConfigLocation</param-name>
      <param-value>/WEB-INF/applicationContext.xml</param-value>
    </context-param>

    <listener>
      <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>
  END

  webxml_file = File.join(java_dir, 'dist', 'pieces','config','WEB-INF','web.xml')
  webxml = File.read(webxml_file)
  webxml.gsub! '</web-app>', "#{SPRING_WEBXML}\n</web-app>"
  
  f = File.open webxml_file,'w'
  f.puts webxml
  f.close
  
  app_file = File.join(java_dir, 'dist', 'pieces','public','appcelerator.xml')
  appxml = File.read(app_file)
  appxml.gsub! '<service>java</service>', "<service>spring</service>"
  
  f = File.open app_file,'w'
  f.puts appxml
  f.close

  compile_dir(java_source, java_classes, "#{build_dir}/pieces/lib")
  jar_file = File.expand_path(File.join(java_dir, "dist/pieces/lib/appcelerator-#{version}.jar"))
  create_jar_wmf(jar_file, java_classes, "#{AGENT_MF}")
  compile_dir("#{build_dir}/pieces/services", "#{java_dir}/dist/pieces/services", "#{java_dir}/dist/pieces/lib")
  compile_dir("#{spring_service_dir}/pieces/services", "#{java_dir}/dist/pieces/services", "#{java_dir}/dist/pieces/lib")

  FileUtils.cd(java_classes) do
    excludes = %w(pieces/lib/optional/spring-2.5.6.jar pieces/lib/optional/ant-1.7.0.jar pieces/lib/optional/cglib-2.1.3.jar pieces/lib/optional/junit.jar)

    zip_file = build_config[:output_filename]
    FileUtils.rm_rf zip_file
    Zip::ZipFile.open(zip_file, Zip::ZipFile::CREATE) do |zip_file|
      zip_dir(zip_file, "#{java_dir}/dist/pieces/config/WEB-INF", "WEB-INF")
      Dir["#{java_dir}/dist/pieces/lib/*.jar"].each do |file|
        zip_file.add("WEB-INF/lib/#{file["#{java_dir}/dist/pieces/lib/".length, file.length]}", file)
      end
      Dir["#{java_dir}/dist/pieces/lib/optional/*.jar"].each do |file|
        zip_file.add("WEB-INF/lib/#{file["#{java_dir}/dist/pieces/lib/optional/".length, file.length]}", file)
      end
      zip_dir(zip_file, "#{java_dir}/dist/pieces/services", "WEB-INF/classes")
      zip_dir(zip_file, "#{java_dir}/dist/pieces/public")
      zip_websdk(zip_file)
    end
  end
  FileUtils.rm_rf java_dir
end

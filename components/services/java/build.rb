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

desc "Build the Java Service"
task :java do

  build_dir = File.expand_path(File.dirname(__FILE__))
  build_config = get_config(:service, :java)

  require File.join(build_dir, "../common", "common.rb")
  require File.join(build_dir, "common.rb")

  version = build_config[:version]
  java_dir = File.expand_path "#{STAGE_DIR}/java"
  java_classes = File.expand_path "#{java_dir}/classes"
  java_source = File.expand_path "#{build_dir}/src"

  clean_dir(java_dir)

# warning-aco if you screw up the spaces here, you will pay in silent errors!!!
  AGENT_MF=<<-END
Premain-Class: org.appcelerator.agent.SimpleInstrumentor
Can-Redefine-Classes: true
  END
# end warning-aco
  
  FileUtils.mkdir_p(java_classes)
  FileUtils.mkdir_p(File.join(java_dir,'dist')) rescue nil
  FileUtils.mkdir_p(File.join(java_dir,'dist','lib')) rescue nil

  copy_dir "#{build_dir}/pieces", File.join(java_dir,'dist/pieces')
  compile_dir(java_source, java_classes, "#{build_dir}/pieces/lib")
  jar_file = File.expand_path(File.join(java_dir, "dist/pieces/lib/entourage-#{build_config[:version]}.jar"))
  create_jar_wmf(jar_file, java_classes, "#{AGENT_MF}")
  compile_dir("#{build_dir}/pieces/services", "#{java_dir}/dist/pieces/services", "#{java_dir}/dist/pieces/lib")

  FileUtils.cd(java_classes) do
    excludes = %w(pieces/lib/optional/spring-2.5.6.jar pieces/lib/optional/ant-1.7.0.jar pieces/lib/optional/cglib-2.1.3.jar pieces/lib/optional/junit.jar)

    zip_file = build_config[:output_filename]
    FileUtils.rm_rf zip_file
    Zip::ZipFile.open(zip_file, Zip::ZipFile::CREATE) do |zip_file|
      zip_dir(zip_file, "#{java_dir}/dist/pieces/config/WEB-INF", "WEB-INF")
      Dir["#{java_dir}/dist/pieces/lib/*.jar"].each do |file|
        zip_file.add("WEB-INF/lib/#{file["#{java_dir}/dist/pieces/lib/".length, file.length]}", file)
      end
      zip_dir(zip_file, "#{java_dir}/dist/pieces/services", "WEB-INF/classes")
      zip_dir(zip_file, "#{java_dir}/dist/pieces/public")
      zip_websdk(zip_file)
    end
  end
  FileUtils.rm_rf java_dir
end

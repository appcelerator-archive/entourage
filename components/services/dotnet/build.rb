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

desc 'default build'
task :dotnet do

  build_dir = "#{File.dirname(__FILE__)}" 
  build_config = get_config(:service, :dotnet)

  require File.join(build_dir, "..", "common", "common.rb")

  FileUtils.mkdir_p STAGE_DIR

  zip_file = build_config[:output_filename]
  FileUtils.rm_rf zip_file
  Zip::ZipFile.open(zip_file, Zip::ZipFile::CREATE) do |zip_file|
    zip_dir(zip_file, "#{build_dir}/src", "src")
    zip_file.add 'public/appcelerator.xml', "#{build_dir}/installer/appcelerator.xml"
    zip_file.add 'app/services/TestService.dll', "#{build_dir}/installer/TestService.dll"
    zip_websdk(zip_file, "public")
  end
end

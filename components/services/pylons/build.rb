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
desc 'default pylons build'
task :pylons do

  build_dir = File.expand_path(File.dirname(__FILE__))
  build_config = get_config(:service, :pylons)

  version = build_config[:version]
  zip_file = build_config[:output_filename]
  FileUtils.rm_rf zip_file
  
  stub_dir = "#{build_dir}/stub"

  Zip::ZipFile.open(zip_file, Zip::ZipFile::CREATE) do |zip_file|
    dofiles(stub_dir) do |f|
      filename = f.to_s
      if not(filename == '.') and not(filename[0] == ?.)
        zip_file.add(filename, "#{stub_dir}/#{filename}")
      end
    end
    websdk("public/").each do |key, value|
      zip_file.add(key, value)
    end
  end
  
end


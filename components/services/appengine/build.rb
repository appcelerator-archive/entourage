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
  desc 'default google-appengine-python build'
  task :appengine do
    
    build_dir = "#{File.dirname(__FILE__)}" 
    build_config = get_config(:service, :appengine)
    zipfile = build_config[:output_filename]
    
    FileUtils.mkdir_p "#{STAGE_DIR}"
    FileUtils.rm_rf zipfile
    
    stub_dir = "#{build_dir}/stub"
    
    require File.join(build_dir, "../common", "common.rb")
    
    Zip::ZipFile.open(zipfile, Zip::ZipFile::CREATE) do |zipfile|
      
      dofiles(stub_dir) do |f|
        filename = f.to_s
        next if File.basename(filename[0,1]) == '.'
        zipfile.add(filename,"#{stub_dir}/#{filename}")
      end
      
      websdk("public/").each do |key, value|
        zipfile.add(key, value)
      end
    end
  end

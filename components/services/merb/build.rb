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

desc 'default merb build'
task :merb do

  build_dir = File.expand_path(File.dirname(__FILE__))
  build_config = get_config(:service, :merb)

  require File.join(build_dir, "..", "common", "common.rb")

  FileUtils.mkdir_p "#{STAGE_DIR}"

  zip_file = build_config[:output_filename]
  FileUtils.rm_rf zip_file
  Zip::ZipFile.open(zip_file, Zip::ZipFile::CREATE) do |zip_file|
    %w(app config lib).each do |dir|
      zip_dir(zip_file, "#{build_dir}/src/#{dir}", "#{dir}")
    end
    zip_file.add 'public/appcelerator.xml', "#{build_dir}/src/public/appcelerator.xml"
    zip_websdk(zip_file, "public")
  end
end

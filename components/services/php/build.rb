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

desc 'Build the PHP Service'
task :php do

  build_dir = File.expand_path(File.dirname(__FILE__))
  build_config = get_config(:service, :php)

  require File.join(build_dir, "..", "common", "common.rb")

  stage_dir = File.expand_path("#{STAGE_DIR}/php")
  copy_dir "#{build_dir}/pieces", File.join(stage_dir,'pieces')

  FileUtils.mkdir_p "#{stage_dir}"

  zip_file = build_config[:output_filename]
  FileUtils.rm_rf(zip_file)

  FileUtils.cp("#{build_dir}/install.rb", stage_dir)

  Zip::ZipFile.open(zip_file, Zip::ZipFile::CREATE) do |zip_file|
    zip_dir(zip_file, "#{stage_dir}/pieces/services", "app/services")
    zip_dir(zip_file, "#{stage_dir}/pieces/public", "public")
    zip_websdk(zip_file, "public")
  end
  FileUtils.rm_rf stage_dir
end

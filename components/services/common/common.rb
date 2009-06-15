# Copyright 2006-2009 Appcelerator, Inc.
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

def websdk(prefix="")
  prefix = "#{prefix}/" unless prefix =~ /^\s*$/ or prefix =~ /\/$/
  websdk = {}
  websdk["#{prefix}javascripts/entourage.js"] = "#{STAGE_DIR}/websdk/javascripts/entourage.js"
  websdk["#{prefix}javascripts/entourage-debug.js"] ="#{STAGE_DIR}/websdk/javascripts/entourage-debug.js"
  %w(components).each do |file|
    Dir["#{WEBSDK_DIR}/ui/src/#{file}/**/*"].each do |inc_file|
      websdk["#{prefix}entourage-ui/#{inc_file["#{WEBSDK_DIR}/ui/src/#{file}/".length, inc_file.length]}"] = inc_file
    end
  end
  %w(web).each do |file|
    Dir["#{WEBSDK_DIR}/ui/src/#{file}/**/*"].each do |inc_file|
      websdk["#{prefix}#{inc_file["#{WEBSDK_DIR}/ui/src/#{file}/".length, inc_file.length]}"] = inc_file
    end
  end
  return websdk
end

def zip_dir(zip_file, src_dir, prefix="")
  src_dir = "#{src_dir}/" unless src_dir =~ /\/$/
  prefix = "#{prefix}/" unless prefix =~ /^\s*$/ or prefix =~ /\/$/
  Dir["#{src_dir}**/*"].each do |file|
    zip_file.add("#{prefix}#{file["#{src_dir}".length, file.length]}", file)
  end
end

def zip_websdk(zip_file, prefix="")
  websdk(prefix).each do |key, value|
    zip_file.add(key, value)
  end
end

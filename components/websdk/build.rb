namespace :websdk do
  
  BUILD_CONFIG = get_config(:websdk, :websdk)
  WEBSDK_STAGE_DIR = File.join(STAGE_DIR, 'websdk')
  JAVASCRIPT_PATH = "javascripts"
  JAVASCRIPT_DEST_DIR = "#{WEBSDK_STAGE_DIR}/#{JAVASCRIPT_PATH}" # staging location
  TESTS_PATH = "tests"
  TESTS_DEST_DIR = "#{WEBSDK_STAGE_DIR}/#{TESTS_PATH}" # staging location
  LICENSE_HEADER=<<END_LICENSE
/*!(c) 2006-#{Time.now.strftime('%Y')} Appcelerator, Inc. http://appcelerator.org
 * Licensed under the Apache License, Version 2.0. Please visit
 * http://license.appcelerator.com for full copy of the License.
 * Version: #{BUILD_CONFIG[:version]}, Released: #{Time.now.strftime('%m/%d/%Y')}
 **/
END_LICENSE
  TEMP_JS = "#{JAVASCRIPT_DEST_DIR}/entourage-temp.js"
  SWISS_JS = "#{WEBSDK_DIR}/lib/swiss/src/js/swiss.js"
  SWISS_JQUERY_JS = "#{WEBSDK_DIR}/lib/swiss/src/js/swiss-jquery.js"
  SWISS_PROTOTYPE_JS = "#{WEBSDK_DIR}/lib/swiss/src/js/swiss-prototype.js"
  JQUERY_JS = "#{WEBSDK_DIR}/lib/swiss/src/lib/jquery.js"
  JQUERY_UI_JS = "#{WEBSDK_DIR}/lib/swiss/src/lib/jquery-ui.js"
  PROTOTYPE_JS = "#{WEBSDK_DIR}/lib/swiss/src/lib/prototype.js"
  SCRIPTACULOUS_JS = "#{WEBSDK_DIR}/lib/swiss/src/lib/scriptaculous-all.js"
  TEST_DIR = "#{WEBSDK_DIR}/test"

  task :default => [:all] do
  end
  
  task :all => [:build, :test] do
  end
  
  task :init do
    FileUtils.rm_rf JAVASCRIPT_DEST_DIR if File.exists?(JAVASCRIPT_DEST_DIR)
    FileUtils.mkdir_p JAVASCRIPT_DEST_DIR unless File.exists?(JAVASCRIPT_DEST_DIR)
  end
  
  desc 'build websdk files'
  task :build => [:mq,
                  :mq_jquery, 
                  :mq_prototype, 
                  :wel, 
                  :wel_jquery, 
                  :wel_prototype,
                  :mq_wel,
                  :mq_wel_jquery,
                  :mq_wel_prototype,
                  :mq_wel_ui,
                  :mq_wel_ui_jquery,
                  :mq_wel_ui_prototype,
                  :websdk] do
  end
  task :mq => [:init] do
    puts "\nBuilding websdk:mq"
    prod_js = "#{JAVASCRIPT_DEST_DIR}/entourage-mq.js"
    debug_js = "#{JAVASCRIPT_DEST_DIR}/entourage-mq-debug.js"

    js_files = [SWISS_JS]
    js_files = js_files + core_files
    js_files = js_files + mq_files
    combine_files(debug_js, js_files, 'includes: swiss and mq')
    compress_file(debug_js, prod_js)
    archive_files("#{STAGE_DIR}/entourage-websdk-mq-#{BUILD_CONFIG[:version]}.zip", {
      "#{JAVASCRIPT_PATH}/entourage.js" => prod_js,
      "#{JAVASCRIPT_PATH}/entourage-debug.js" => debug_js,
    })
  end
  
  task :mq_jquery => [:init] do
    puts "\nBuilding websdk:mq_jquery"
    prod_js = "#{JAVASCRIPT_DEST_DIR}/entourage-mq-jquery.js"
    debug_js = "#{JAVASCRIPT_DEST_DIR}/entourage-mq-jquery-debug.js"

    js_files = [JQUERY_JS, SWISS_JS, SWISS_JQUERY_JS]
    js_files = js_files + core_files
    js_files = js_files + mq_files
    combine_files(debug_js, js_files, 'includes: jquery, swiss and mq')
    compress_file(debug_js, prod_js)
    archive_files("#{STAGE_DIR}/entourage-websdk-mq-jquery-#{BUILD_CONFIG[:version]}.zip", {
      "#{JAVASCRIPT_PATH}/entourage.js" => prod_js,
      "#{JAVASCRIPT_PATH}/entourage-debug.js" => debug_js,
    })
  end
  
  task :mq_prototype => [:init] do
    puts "\nBuilding websdk:mq_prototype"
    prod_js = "#{JAVASCRIPT_DEST_DIR}/entourage-mq-prototype.js"
    debug_js = "#{JAVASCRIPT_DEST_DIR}/entourage-mq-prototype-debug.js"

    js_files = [PROTOTYPE_JS, SWISS_JS, SWISS_PROTOTYPE_JS]
    js_files = js_files + core_files
    js_files = js_files + mq_files
    combine_files(debug_js, js_files, 'includes: prototype, swiss and mq')
    compress_file(debug_js, prod_js)
    archive_files("#{STAGE_DIR}/entourage-websdk-mq-prototype-#{BUILD_CONFIG[:version]}.zip", {
      "#{JAVASCRIPT_PATH}/entourage.js" => prod_js,
      "#{JAVASCRIPT_PATH}/entourage-debug.js" => debug_js,
    })
  end

  task :wel => [:init] do
    puts "\nBuilding websdk:wel"
    prod_js = "#{JAVASCRIPT_DEST_DIR}/entourage-wel.js"
    debug_js = "#{JAVASCRIPT_DEST_DIR}/entourage-wel-debug.js"

    js_files = [SWISS_JS]
    js_files = js_files + core_files
    js_files = js_files + wel_files
    combine_files(debug_js, js_files, 'includes: swiss and wel')
    compress_file(debug_js, prod_js)
    archive_files("#{STAGE_DIR}/entourage-websdk-wel-#{BUILD_CONFIG[:version]}.zip", {
      "#{JAVASCRIPT_PATH}/entourage.js" => prod_js,
      "#{JAVASCRIPT_PATH}/entourage-debug.js" => debug_js
    })
  end

  task :wel_jquery => [:init] do
    puts "\nBuilding websdk:wel_jquery"
    prod_js = "#{JAVASCRIPT_DEST_DIR}/entourage-wel-jquery.js"
    debug_js = "#{JAVASCRIPT_DEST_DIR}/entourage-wel-jquery-debug.js"

    js_files = [JQUERY_JS, SWISS_JS, SWISS_JQUERY_JS]
    js_files = js_files + core_files
    js_files = js_files + wel_files
    combine_files(debug_js, js_files, 'includes: jquery, swiss and wel')
    compress_file(debug_js, prod_js)
    archive_files("#{STAGE_DIR}/entourage-websdk-wel-jquery-#{BUILD_CONFIG[:version]}.zip", {
      "#{JAVASCRIPT_PATH}/entourage.js" => prod_js,
      "#{JAVASCRIPT_PATH}/entourage-debug.js" => debug_js
    })
  end

  task :wel_prototype => [:init] do
    puts "\nBuilding websdk:wel_prototype"
    prod_js = "#{JAVASCRIPT_DEST_DIR}/entourage-wel-prototype.js"
    debug_js = "#{JAVASCRIPT_DEST_DIR}/entourage-wel-prototype-debug.js"

    js_files = [PROTOTYPE_JS, SWISS_JS, SWISS_PROTOTYPE_JS]
    js_files = js_files + core_files
    js_files = js_files + wel_files
    combine_files(debug_js, js_files, 'includes: prototype, swiss and wel')
    compress_file(debug_js, prod_js)
    archive_files("#{STAGE_DIR}/entourage-websdk-wel-prototype-#{BUILD_CONFIG[:version]}.zip", {
      "#{JAVASCRIPT_PATH}/entourage.js" => prod_js,
      "#{JAVASCRIPT_PATH}/entourage-debug.js" => debug_js
    })
  end

  task :mq_wel => [:init] do
    puts "\nBuilding websdk:mq_wel"
    prod_js = "#{JAVASCRIPT_DEST_DIR}/entourage-mq-wel.js"
    debug_js = "#{JAVASCRIPT_DEST_DIR}/entourage-mq-wel-debug.js"

    js_files = [SWISS_JS]
    js_files = js_files + core_files
    js_files = js_files + mq_files
    js_files = js_files + wel_files
    combine_files(debug_js, js_files, 'includes: swiss, mq and wel')
    compress_file(debug_js, prod_js)
    archive_files("#{STAGE_DIR}/entourage-websdk-mq-wel-#{BUILD_CONFIG[:version]}.zip", {
      "#{JAVASCRIPT_PATH}/entourage.js" => prod_js,
      "#{JAVASCRIPT_PATH}/entourage-debug.js" => debug_js,
    })
  end

  task :mq_wel_jquery => [:init] do
    puts "\nBuilding websdk:mq_wel_jquery"
    prod_js = "#{JAVASCRIPT_DEST_DIR}/entourage-mq-wel-jquery.js"
    debug_js = "#{JAVASCRIPT_DEST_DIR}/entourage-mq-wel-jquery-debug.js"

    js_files = [JQUERY_JS, SWISS_JS, SWISS_JQUERY_JS]
    js_files = js_files + core_files
    js_files = js_files + mq_files
    js_files = js_files + wel_files
    combine_files(debug_js, js_files, 'includes: jquery, swiss, mq and wel')
    compress_file(debug_js, prod_js)
    archive_files("#{STAGE_DIR}/entourage-websdk-mq-wel-jquery-#{BUILD_CONFIG[:version]}.zip", {
      "#{JAVASCRIPT_PATH}/entourage.js" => prod_js,
      "#{JAVASCRIPT_PATH}/entourage-debug.js" => debug_js,
    })
  end

  task :mq_wel_prototype => [:init] do
    puts "\nBuilding websdk:mq_wel_prototype"
    prod_js = "#{JAVASCRIPT_DEST_DIR}/entourage-mq-wel-prototype.js"
    debug_js = "#{JAVASCRIPT_DEST_DIR}/entourage-mq-wel-prototype-debug.js"

    js_files = [PROTOTYPE_JS, SWISS_JS, SWISS_PROTOTYPE_JS]
    js_files = js_files + core_files
    js_files = js_files + mq_files
    js_files = js_files + wel_files
    combine_files(debug_js, js_files, 'includes: prototype, swiss, mq and wel')
    compress_file(debug_js, prod_js)
    archive_files("#{STAGE_DIR}/entourage-websdk-mq-wel-prototype-#{BUILD_CONFIG[:version]}.zip", {
      "#{JAVASCRIPT_PATH}/entourage.js" => prod_js,
      "#{JAVASCRIPT_PATH}/entourage-debug.js" => debug_js,
    })
  end

  task :mq_wel_ui => [:init] do
    puts "\nBuilding websdk:mq_wel_ui"
    prod_js = "#{JAVASCRIPT_DEST_DIR}/entourage-mq-wel-ui.js"
    debug_js = "#{JAVASCRIPT_DEST_DIR}/entourage-mq-wel-ui-debug.js"

    js_files = [SWISS_JS]
    js_files = js_files + core_files
    js_files = js_files + mq_files
    js_files = js_files + wel_files
    js_files = js_files + ui_files
    combine_files(debug_js, js_files, 'includes: swiss, mq, wel and ui')
    compress_file(debug_js, prod_js)
    includefiles = {}
    includefiles["#{JAVASCRIPT_PATH}/entourage.js"] = prod_js
    includefiles["#{JAVASCRIPT_PATH}/entourage-debug.js"] = debug_js
    %w(components).each do |file|
      Dir["#{WEBSDK_DIR}/ui/src/#{file}/**/*"].each do |includefile|
        includefiles["entourage-ui/#{includefile["#{WEBSDK_DIR}/ui/src/components/".length, includefile.length]}"] = includefile
      end
    end
    archive_files("#{STAGE_DIR}/entourage-websdk-mq-wel-ui-#{BUILD_CONFIG[:version]}.zip", includefiles)
  end

  task :mq_wel_ui_jquery => [:init] do
    puts "\nBuilding websdk:mq_wel_ui_jquery"
    prod_js = "#{JAVASCRIPT_DEST_DIR}/entourage-mq-wel-ui-jquery.js"
    debug_js = "#{JAVASCRIPT_DEST_DIR}/entourage-mq-wel-ui-jquery-debug.js"

    js_files = [JQUERY_JS, JQUERY_UI_JS, SWISS_JS, SWISS_JQUERY_JS]
    js_files = js_files + core_files
    js_files = js_files + mq_files
    js_files = js_files + wel_files
    js_files = js_files + ui_files
    combine_files(debug_js, js_files, 'includes: jquery, swiss, mq, wel and ui')
    compress_file(debug_js, prod_js)
    includefiles = {}
    includefiles["#{JAVASCRIPT_PATH}/entourage.js"] = prod_js
    includefiles["#{JAVASCRIPT_PATH}/entourage-debug.js"] = debug_js
    %w(components).each do |file|
      Dir["#{WEBSDK_DIR}/ui/src/#{file}/**/*"].each do |includefile|
        includefiles["entourage-ui/#{includefile["#{WEBSDK_DIR}/ui/src/components/".length, includefile.length]}"] = includefile
      end
    end
    archive_files("#{STAGE_DIR}/entourage-websdk-mq-wel-ui-jquery-#{BUILD_CONFIG[:version]}.zip", includefiles)
  end

  task :mq_wel_ui_prototype => [:init] do
    puts "\nBuilding websdk:mq_wel_ui_prototype"
    prod_js = "#{JAVASCRIPT_DEST_DIR}/entourage-mq-wel-ui-prototype.js"
    debug_js = "#{JAVASCRIPT_DEST_DIR}/entourage-mq-wel-ui-prototype-debug.js"

    js_files = [PROTOTYPE_JS, SCRIPTACULOUS_JS, SWISS_JS, SWISS_PROTOTYPE_JS]
    js_files = js_files + core_files
    js_files = js_files + mq_files
    js_files = js_files + wel_files
    js_files = js_files + ui_files
    combine_files(debug_js, js_files, 'includes: prototype, swiss, mq, wel and ui')
    compress_file(debug_js, prod_js)
    includefiles = {}
    includefiles["#{JAVASCRIPT_PATH}/entourage.js"] = prod_js
    includefiles["#{JAVASCRIPT_PATH}/entourage-debug.js"] = debug_js
    %w(components).each do |file|
      Dir["#{WEBSDK_DIR}/ui/src/#{file}/**/*"].each do |includefile|
        includefiles["entourage-ui/#{includefile["#{WEBSDK_DIR}/ui/src/components/".length, includefile.length]}"] = includefile
      end
    end
    archive_files("#{STAGE_DIR}/entourage-websdk-mq-wel-ui-prototype-#{BUILD_CONFIG[:version]}.zip", includefiles)
  end
  
  task :websdk => [:init] do
    puts "\nBuilding websdk:websdk"
    prod_js = "#{JAVASCRIPT_DEST_DIR}/entourage.js"
    debug_js = "#{JAVASCRIPT_DEST_DIR}/entourage-debug.js"

    js_files = [JQUERY_JS, JQUERY_UI_JS, SWISS_JS, SWISS_JQUERY_JS]
    js_files = js_files + core_files
    js_files = js_files + mq_files
    js_files = js_files + wel_files
    js_files = js_files + ui_files
    combine_files(debug_js, js_files, 'includes: jquery, swiss, mq, wel and ui')
    compress_file(debug_js, prod_js)
    includefiles = {}
    includefiles["#{JAVASCRIPT_PATH}/entourage.js"] = prod_js
    includefiles["#{JAVASCRIPT_PATH}/entourage-debug.js"] = debug_js
    %w(components).each do |file|
      Dir["#{WEBSDK_DIR}/ui/src/#{file}/**/*"].each do |includefile|
        includefiles["entourage-ui/#{includefile["#{WEBSDK_DIR}/ui/src/components/".length, includefile.length]}"] = includefile
      end
    end
    %w(web).each do |file|
      Dir["#{WEBSDK_DIR}/ui/src/#{file}/**/*"].each do |includefile|
        includefiles[includefile["#{WEBSDK_DIR}/ui/src/#{file}/".length, includefile.length]] = includefile
      end
    end
    archive_files("#{STAGE_DIR}/entourage-websdk-#{BUILD_CONFIG[:version]}.zip", includefiles)
  end
  
  desc 'test websdk files'
  task :test => [:build] do
    puts "\nBuilding websdk:test"
    cp_r TEST_DIR, "#{WEBSDK_STAGE_DIR}/testmonkey"
    cp_r "#{WEBSDK_DIR}/ui/src/components", "#{WEBSDK_STAGE_DIR}/testmonkey/entourage-ui"
    %w(core mq ui wel).each do |dir|
      cp_r "#{WEBSDK_DIR}/#{dir}/tests", "#{WEBSDK_STAGE_DIR}/testmonkey/tests/#{dir}"
    end
    cp_r "#{WEBSDK_STAGE_DIR}/javascripts", "#{WEBSDK_STAGE_DIR}/testmonkey/javascripts"

    cp_r "#{WEBSDK_DIR}/ui/visual_tests", "#{WEBSDK_STAGE_DIR}/visual_tests"
    cp_r "#{WEBSDK_DIR}/ui/src/components", "#{WEBSDK_STAGE_DIR}/visual_tests/entourage-ui"
    cp_r "#{WEBSDK_STAGE_DIR}/javascripts", "#{WEBSDK_STAGE_DIR}/visual_tests/javascripts"
  end
  
  def archive_files(zip_file, src_files)
    FileUtils.rm_rf zip_file if File.exists? zip_file
    Zip::ZipFile.open(zip_file, Zip::ZipFile::CREATE) do |zip_file|
      src_files.each do |key, value|
        zip_file.add(key, value)
      end
      zip_file.get_output_stream('build.yml') do |f| 
        f.puts BUILD_CONFIG.to_yaml
      end
    end
  end
  
  def combine_files(dest_file, src_files, header="")
    FileUtils.rm_rf dest_file if File.exists?(dest_file)
    append_file(LICENSE_HEADER, dest_file, true)
    append_file("\n/* #{header} */\n\n", dest_file, true)
    src_files.each do |file|
      puts File.basename(file) if VERBOSE
      append_file("\n/* #{File.basename(file)} */\n\n", dest_file, true)
      append_file(file, dest_file)
      append_file("\n//" + ("-" * 80) + "\n", dest_file, true)
    end
  end
  
  def compress_file(src_file, dest_file)
    FileUtils.rm_rf dest_file if File.exists?(dest_file)
    f = File.open(TEMP_JS, 'w')
    f.write compress_and_mangle(src_file, File.read(src_file))
    f.close
    append_file(TEMP_JS, dest_file)
    FileUtils.rm_rf TEMP_JS if File.exists?(TEMP_JS)
  end
  
  def cp_r(src,dst)
    src_root = Pathname.new(src)
    FileUtils.mkdir_p(dst, :verbose => VERBOSE) unless File.exists? dst
    Dir["#{src}/**/**"].each do |abs_path|
      src_path = Pathname.new(abs_path)
      rel_path = src_path.relative_path_from(src_root)
      dst_path = "#{dst}/#{rel_path.to_s}"

      next if abs_path.include? '.git'

      if src_path.directory?
        FileUtils.mkdir_p(dst_path, :verbose => VERBOSE)
      elsif src_path.file?
        FileUtils.cp(abs_path, dst_path, :verbose => VERBOSE)
      end
    end
  end
  
  def core_files
    js_files = []
    js_files << "#{WEBSDK_DIR}/core/src/util.js"
    js_files << "#{WEBSDK_DIR}/core/src/browser.js"
    js_files << "#{WEBSDK_DIR}/core/src/compiler.js"
  end
  
  def mq_files
    js_files = []
    js_files << "#{WEBSDK_DIR}/mq/src/mq.js"
    js_files << "#{WEBSDK_DIR}/mq/src/listeners/servicebroker.mq.js"
    js_files << "#{WEBSDK_DIR}/mq/src/listeners/rails.mq.js"
  end
  
  def wel_files
    js_files = []
    js_files << "#{WEBSDK_DIR}/wel/src/string.js"
    js_files << "#{WEBSDK_DIR}/wel/src/wel.js"
    js_files << "#{WEBSDK_DIR}/wel/src/api.js"
    js_files << "#{WEBSDK_DIR}/wel/src/statemachine.js"	
    js_files << "#{WEBSDK_DIR}/wel/src/history.js"
    Dir["#{WEBSDK_DIR}/wel/src/actions/*.js"].each { |file| js_files << file }
    Dir["#{WEBSDK_DIR}/wel/src/conditions/*.js"].each { |file| js_files << file }
    Dir["#{WEBSDK_DIR}/wel/src/processors/*.js"].each { |file| js_files << file }
    Dir["#{WEBSDK_DIR}/wel/src/forms/*.js"].each { |file| js_files << file }
    Dir["#{WEBSDK_DIR}/wel/src/forms/processors/*.js"].each { |file| js_files << file }
    js_files
  end
  
  def ui_files
    js_files = []
    js_files << "#{WEBSDK_DIR}/ui/src/uri.js"
    js_files << "#{WEBSDK_DIR}/ui/src/api.js"
    js_files << "#{WEBSDK_DIR}/ui/src/core.js"
    js_files << "#{WEBSDK_DIR}/ui/src/processors.js"
    js_files << "#{WEBSDK_DIR}/ui/src/themes.js"
  end

end

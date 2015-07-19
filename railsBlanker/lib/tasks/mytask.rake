desc "rsync rails project to :dest"
task :rsync, [:opt, :dest] do |t, args|
  args.with_defaults(:opt => '-av', :dest => "sakura:~/myapps/railsBlanker/")
  sh "rsync #{args[:opt]} . #{args[:dest]} --exclude-from '.rsync_exclude' --delete-before"
end

desc "run command at remote"
task :ssh_cd_run, [:com, :dir, :host] do |t, args|
  args.with_defaults(host: 'sakura',
                     dir:  '~/myapps/railsBlanker/')
  coms_in_ssh = ["source .bash_profile",
                 "cd #{args[:dir]}",
                 args[:com]]
  sh( "ssh #{args[:host]}" + " ' " + coms_in_ssh.join('; ') + " ' " )
end

desc "restart daemon server"
task :restart, [:remote, :port] do |t, args|
  args.with_defaults(port: '3000')
  Rake::Task['stop'].execute
  Rake::Task['start'].execute(args)
end

desc "stop daemon server"
task :stop do
  sh "kill -9 $(cat tmp/pids/server.pid)"
end

desc "start daemon server"
task :start, [:port] do |t, args|
  args.with_defaults(port: '3000')
  sh "rails s -d -p #{args[:port]}"
end


desc "search daemon server"
task :search, [:key] do |t, args|
  args.with_defaults(key: 'ruby')
  sh "ps aux | grep #{args[:key]}"
end


# prior running on production
# http://stackoverflow.com/questions/17904949/rails-app-not-serving-assets-in-production-environment
# rake db:migrate; rake assets:precompile; SECRET_KEY_BASE=`rake secret`; RAILS_ENV=production; rails s


## examples ##
#
# rake "ssh_cd_run[rake 'restart[3005]']"
# => (local)  ssh sakura ' source .bash_profile; cd ~/myapps/wordCollectorRails/; rake 'restart[3005]' ' 
#    (remote) kill -9 $(cat tmp/pids/server.pid)
#    (remote) rails s -d -p 3005
#
# rake "ssh_cd_run[rake search]" 
# => (local)  ssh sakura ' source .bash_profile; cd ~/myapps/wordCollectorRails/; rake search ' 
#    (remote) ps aux | grep ruby
#
# rake "ssh_cd_run[rake 'run_rb[add_order.rb]']"
# => (local)  ssh sakura ' source .bash_profile; cd ~/myapps/wordCollectorRails/; rake 'run_rb[add_order.rb]' ' 
#    (remote) bundle exec rails runner "eval(File.read 'lib/tasks/add_order.rb')"
#
# 
# rake "ssh_cd_run[rake \'restart[user\,pass\,3005]\']"
#

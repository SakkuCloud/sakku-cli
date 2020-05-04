export const messages = {
  username_req: 'Please type your Username (Hint: sometimes username is equal to email)',
  password_req: 'Please type your Password',
  problem_in_login_msg: 'Oops!\nthere is a problem with login!',
  login_success: 'User logged in successfully!',
  enter_your_app_name_msg: 'Enter your app name',
  enter_your_ram_msg: 'Enter your ram (GB)',
  enter_your_core_msg: 'Enter your CPU (core)',
  enter_your_disk_msg: 'Enter your disk (GB)',
  enter_your_min_ram_per_instance_msg: 'Enter your min ram per instance',
  enter_your_max_ram_per_instance_msg: 'Enter your max ram per instance',
  enter_your_min_core_per_instance_msg: 'Enter your min core per instance',
  enter_your_max_core_per_instance_msg: 'Enter your max core per instance',
  enter_your_min_instance_msg: 'Enter your min instance',
  enter_your_max_instance_msg: 'Enter your max instance',
  enter_your_cmd_msg: 'Enter your cmd',
  enter_your_link_name_msg: 'Enter your link name',
  enter_your_link_alias_msg: 'Enter your link alias',
  enter_your_args_msg: 'Enter your arg',
  enter_your_git_username_msg: 'Enter your git username',
  enter_your_git_access_token_msg: 'Enter your git access token',
  enter_your_git_url_msg: 'Enter your git url',
  enter_your_image_name_msg: 'Enter your image name',
  enter_your_port_msg: 'Enter your port',
  enter_your_port_ssl_msg: 'Enter ssl (Enter true / false)',
  enter_only_internal_port_msg: 'Is it only internal port? (Enter true / false)',
  enter_basic_authentication_port_msg: 'Use basic authentication? (Enter true / false)',
  enter_your_protocol_msg: 'Enter your protocol',
  enter_your_environment_key_msg: 'Enter your env key',
  enter_your_environment_value_msg: 'Enter your env value',
  enter_your_label_key_msg: 'Enter your label key',
  enter_your_label_value_msg: 'Enter your label value',
  enter_network_name: 'Enter network name',
  click_here_to_login_msg: 'CLICK HERE TO LOGIN TO SAKKU!',
  w8_msg: 'Please wait ',
  abort_msg: 'Abort! :(',
  done_msg: 'Done! :)',
  exec_exit_msg: '\nEnding session\n',
  enter_your_instance_msg: 'Enter your the instance number you want',
  enter_your_check_point: 'Enter your check point for health check (default is /ping)',
  enter_your_response: 'Enter your response for health check',
  enter_your_scheme: 'Enter your scheme for health check (default is http)',
  loggedin: 'You are logged in.',
  tryToLog: 'Logging in to Sakku...',
  incorrect_credentials: 'Incorrect username or password.',
  unexpected: 'Unexpected Error',
  not_logged_in: 'You are not logged in. Please Login with your credentials',
  appIdName: 'Enter app id/name',
  enter_app_id: 'Enter app id',
  enter_domain: 'Enter domain',
  enter_record_name: 'Enter record name',
  enter_record_ttl: 'Enter record ttl',
  select_record_type: 'Select type of record',
  select_type_of_record_for_update: 'Select type of record you want to update',
  add_any_records: 'Is there any/more records (y or n)',
  add_any_record_comments: 'Is there any/more comments (y or n)',
  enter_record_content: 'Enter record content',
  record_is_disabled: 'Is record disabled? (Enter true / false)',
  enter_record_comment_account: 'Enter record comment account',
  enter_record_comment_content: 'Enter record comment content',
  record_comment_modified_at: 'Enter record comment modified at',
  domain_remove_success: 'Domain removed successfully!',
  domain_remove_confirm: 'Are you sure you want to remove this domain? (y or n)',
  domain_remove_cancel: 'Domain removing operation is canceled!',
  network_remove_success: 'Network removed successfully!',
  network_remove_confirm: 'Are you sure you want to remove this network? (y or n)',
  network_remove_cancel: 'Network removing operation is canceled!',
  network_app_remove_success: 'App removed successfully from network!',
  network_app_remove_confirm: 'Are you sure you want to remove the app from this network? (y or n)',
  network_app_remove_cancel: 'App removing from network operation is canceled!',
  noInstance: 'There is no instance!',
  connectionSuccess: 'Connection established successfully.',
  connectionFail: 'Can not connect to remote host!',
  enter_username: 'Enter your username',
  environment_vars: 'Is there any/more environments (y or n)',
  labels: 'Is there any/more labels (y or n)',
  health_check: 'Is there any/more health checks (y or n)',
  args: 'Is there any/more args (y or n)',
  private_repo: 'Is it a private repository (y or n)',
  ports: 'Is there any/more ports (y or n)',
  enter_access_token: 'Enter your access token',
  app_add_success: 'Your app is successfully added.',
  enter_image_name: 'Enter your image name',
  enter_docker_file_address: 'Enter your docker file address and name (default is /Dockerfile)',
  enter_docker_compose_file: 'Enter your docker compose file path with this name: docker-compose.yml',
  enter_branch_name: 'Enter your branch name (default is master)',
  more_tag: 'Is there any/more tags (y or n)',
  enter_tag: 'Enter your tag',
  more_build_args: 'Is there any/more build arguments (y or n)',
  enter_build_arg: 'Enter your build argument',
  enter_build_mode: 'Enter build mode: {local or remote?}',
  remote_build_success: 'Remote build has done succesfully!',
  empty_temp_folder_success: 'Temporary folder emptied succesfully!',
  zip_file_create_success: 'Zip file created succesfully!',
  empty_list: 'Empty List',
  empty_log: 'There is no log!',
  enter_collab_email: 'Enter your collaborator\'s email',
  enter_collab_image_reg: 'Enter your collaborator\'s image registry (Optional)',
  col_add_success: 'Collaborator added successfully.',
  col_edit_success: 'Collaborator edited successfully.',
  collab_del_success: 'Collaborator deleted successfully.',
  enter_collab_id: 'Enter your collaborator\'s id',
  enter_local_image: 'please enter local image name',
  enter_local_image_tag: 'Enter your local image tag (optional, default:latest)',
  enter_new_image_name_tag: 'Enter your new image name and tag (required format: name:tag)',
  deploySuccess: 'Deploy completed successfully.',
  image_pushed_success: 'Image pushed successfuly!',
  docker_not_running: 'Docker is not running! Run Docker or check your dockerd!',
  docker_not_installed: 'Docker is not installed!',
  enter_page_size: 'Enter the page size (default is 30)',
  enter_page_number: 'Enter the page number you want',
  enter_path: 'Enter the path to your file or folder (default is /)',
  enter_man_path: 'Enter the path of the file or folder you want to download',
  enter_dl_path: 'Enter the path where you want the file to be placed',
  continue: 'Do you want to continue',
  nextPage: 'Do you want to see the next page',
  upload_path: 'Enter the path of the file you want to upload',
  remote_path: 'Enter the path on the server where you want your file to be uploaded',
  app_change_ports_success: 'Application ports changed successfully!',
  enter_certification_file_id: 'Enter certification file ID',
  zip_file_size_is_big: 'It\'s too big! Zip file size should be less than 150M!',
  enter_check_rate_for_helath_check: 'Enter check rate',
  enter_endpoint_for_helath_check: 'Enter endpoint',
  enter_intial_delay_for_helath_check: 'Enter intial delay',
  enter_response_code_for_helath_check: 'Enter response code',
  enter_response_message_for_helath_check: 'Enter response message',
  enter_scheme_for_helath_check: 'Enter scheme',
  enter_health_check_id: 'Enter health check Id',
  helthCheck_remove_success: 'Health check removed successfully!',
  helthCheck_remove_confirm: 'Are you sure you want to remove this health check? (y or n)',
  helthCheck_remove_cancel: 'Removing health check was canceled!',
  enter_from_date: 'Enter from date in yyyy/mm/dd | yyyy/mm/dd H:i:s format (Georgian)',
  enter_to_date: 'Enter to date in yyyy/mm/dd | yyyy/mm/dd H:i:s fromat (Georgian)',
  log_file_create_success: 'Log file created successfully! in ',
  enter_file_dir: 'Enter log file directory without file name: (**hint: If you want to save logs in a file, fill this field else skip it!)',
  enter_target_user_email: 'Enter target user email',
  choose_notif_sens_level: 'Choose notification sensitivity level',
  choose_collab_access_level: 'Choose collaborator access level',
  commit_app: 'Do you want to commit application before stop it? (y or n)',
  force_stop_app: 'Do you want to force stop application? (y or n)',
  enter_tag_for_commit: 'Enter application\'s tag that you want to commit: (empty = now in format:yyyy-MM-dd-HH-mm-ss)',
  create_pipeline_permission: 'Do you want to continue pipeline creation of these applications? (y or n)',
  operation_cancel: 'Operation is canceled!',
  app_config_review: 'Applications configiguration review ...\n',
  pipeline_app_under_construction: 'Pipeline applications are being created!',
}
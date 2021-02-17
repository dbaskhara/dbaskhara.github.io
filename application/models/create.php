<?php
class create extends CI_Model
{
    public function __construct()
    {
        Parent::__construct();
        $this -> load -> model('read');
    }
    public function story()
    {
        $data = array(
            'title' => $this->input->post('title'),
            'story' => $this->input->post('story'),
            'username' => $this->input->post('username')
        );
        $this->db->insert('stories', $data);
        redirect(base_url());
    }
    public function user()
    {
        $set = '123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $code = substr(str_shuffle($set), 0, 12);
        $password1 = $this->input->post('password');
        $password2 = $this->input->post('passwordRe');
        $check_email = $this -> read -> search_email($this->input->post('email'));
        if (strcmp($password1, $password2) === 0 && $check_email === 0) {
            $data = array(
                'username' => $this->input->post('username'),
                'password' => $this->input->post('password'),
                'email' => $this->input->post('email'),
                'verification_code' => $code,
                'active' => '0'
            );
            $this->db->insert('users', $data);
            redirect(base_url());
        }
        else if($check_email > 0){
            redirect('http://localhost/blog/Welcome/Register/Email');
        }
        else {
            redirect('http://localhost/blog/Welcome/Register/Wrong');
        }
    }
}

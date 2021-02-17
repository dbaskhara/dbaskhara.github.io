<?php
class Welcome extends CI_Controller
{
	public function __construct()
	{
		Parent::__construct();
		$this->load->model('create');
		$this->load->model('read');
		$this->load->model('update');
		$this->load->model('delete');
		$this -> load -> library('session');
	}
	public function index()
	{
		$this->load->library('pagination');
		if (isset($_POST['submit']) || null !== $this->uri->segment(4)) {
			if (isset($_POST['submit'])) {
				$keyword = $_POST['search'];
			} else {
				$keyword =  $this->uri->segment(4);
			}
			$config['base_url'] = "http://localhost/blog/Welcome/index/search/$keyword";
			$config['total_rows'] = $this->read->total_rows($keyword);
			$config['per_page'] = 3;
			if (isset($_POST['submit']) && null !== $this->uri->segment(4)) {
				$keyword = $_POST['search'];
				redirect('http://localhost/blog/Welcome/index/search/' . $keyword);
			} else {
				$data['start'] = $this->uri->segment(5);
			}
			$this->pagination->initialize($config);
			$data['stories'] = $this->read->search($config['per_page'], $data['start'], $keyword);
		} else {
			$config['base_url'] = "http://localhost/blog/Welcome/index";
			$config['total_rows'] = $this->read->total_rows();
			$config['per_page'] = 3;
			$data['start'] = $this->uri->segment(3);
			$this->pagination->initialize($config);
			$data['stories'] = $this->read->search($config['per_page'], $data['start']);
		}
		$this->load->view('frontpage\header');
		$this->load->view('frontpage\index', $data);
		$this->load->view('frontpage\footer');
	}
	public function posting()
	{
		$this->load->view('frontpage\header');
		$this->load->view('frontpage\posting');
		$this->load->view('frontpage\footer');
	}
	public function SendPost()
	{
		$this->create->story();
	}
	public function EditStory($id)
	{
		$data['story'] = $this->read->search_id($id);
		$this->load->view('frontpage\header');
		$this->load->view('frontpage\edit', $data);
		$this->load->view('frontpage\footer');
	}
	public function EditPost($id)
	{
		$this->update->editPostQuery($id);
	}
	public function DeletePost($id)
	{
		$this->delete->deletePostQuery($id);
	}
	public function Register()
	{
		$this->load->view('frontpage\header');
		$this->load->view('frontpage\register');
		$this->load->view('frontpage\footer');
	}
	public function SendUser()
	{
		$this->create->user();
	}
	public function Login()
	{
		$this->load->view('frontpage\header');
		$this->load->view('frontpage\login');
		$this->load->view('frontpage\footer');
	}
	public function Logout()
	{
		$this -> session -> sess_destroy();
		redirect(base_url());
	}
	public function CheckUser()
	{
		$username = $this -> input -> post('username');
		$check_username = $this->read->search_username($username);
		$check_active = $this->read->search_active($username);
		if($check_username > 0 && strcmp((string)$check_active,"1") === 0){
			//$_SESSION['username'] = $username;
			$this -> session -> set_userdata('username',$username);
			redirect(base_url().'Welcome/index');
		}
		else{
			redirect(base_url());
		}
	}

}

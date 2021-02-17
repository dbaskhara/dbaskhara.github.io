<?php
class update extends CI_Model{
    public function editPostQuery($id){
        $data = array(
            'title' => $this -> input -> post('title'),
            'story' => $this -> input -> post('story'),
            'username' => $this -> input -> post('username')
        );
        $this -> db -> where('id_story',$id) -> update('stories',$data);
        redirect(base_url());
    }
}
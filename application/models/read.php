<?php
class read extends CI_Model{
    public function search($limit , $start, $keyword = NULL){
        return $this -> db -> order_by('id_story','DESC') -> like('title',$keyword) -> get('stories',$limit,$start) -> result_array();
    }
    public function search_id($id){
        return $this -> db -> where('id_story',$id) -> get('stories') -> result_array();
    }
    public function search_email($email){
        return $this -> db -> where('email',$email) -> get('users') -> num_rows();
    }
    public function search_active($username){
        $result = $this -> db -> select('active') -> where('username',$username) -> get('users') -> row();
        foreach($result as $active){
            $data = $active;
        }
        return $data;
    }
    public function search_username($username){
        return $this -> db -> where('username',$username) -> get('users') -> num_rows();
    }
    public function total_rows($keyword = NULL){
        return $this -> db -> like('title',$keyword) -> get('stories') -> num_rows();
    }
}
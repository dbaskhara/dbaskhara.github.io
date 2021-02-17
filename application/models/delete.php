<?php
class delete extends CI_Model{
    public function deletePostQuery($id){
        $this -> db -> where('id_story',$id) -> delete('stories');
        redirect(base_url());
    }
}
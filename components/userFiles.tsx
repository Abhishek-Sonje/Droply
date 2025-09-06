"use client"
import React, { useState } from 'react'

 
import FileTabs from './tabs';
import FilesList from './filesList';

function UserFiles() {
    const [selected, setSelected] = useState("files");

     
    return (
      <div>
        <FileTabs onChange={setSelected} />
        <FilesList filter={selected} />
      </div>
    );
}


export default UserFiles;
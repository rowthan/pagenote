import React, {useEffect} from 'react'
import {basePath} from "../../const/env";

export default function Data() {
    useEffect(() => {
        window.location.href = window.location.origin + basePath +"/ext/setting.html#/data"
    }, []);

  return (
      <></>
  )
}

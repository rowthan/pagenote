import React from 'react'
import ImportAndExport from "components/backup/extension/ImportAndExport";

export default function Data() {
  return (
      <div>
        <div className={'max-w-md m-auto mt-20'}>
          <div>
            <ImportAndExport exportBy={'extension'} />
          </div>
        </div>
      </div>
  )
}

import React, { useState, useEffect } from 'react';
import { Button } from 'react-vant';
import { HistoryItem, convertHistory } from './common/storage';

import './History.scss';

const History = () => {
  const [historyList, setHistoryList] = useState<HistoryItem[]>([])
  const [historyLoading, setHistoryLoding] = useState<boolean>(false)

  const loadHistoryList = () => {
    setHistoryLoding(true)
    convertHistory.getAll().then((list) => {
      setHistoryList(list)
      setHistoryLoding(false)
    })
  }

  const handleRefreshClick = () => {
    loadHistoryList()
  }

  useEffect(loadHistoryList, [])

  return (
    <div className='history'>
      <Button onClick={handleRefreshClick} size="small" type="primary" round>刷新</Button>
      <pre className='code'>{JSON.stringify(historyList, null, 2)}</pre>
    </div>
  )
}

export default History;

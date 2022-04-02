import React, { useState, useEffect } from 'react';
import { Replay, DeleteO, StarO, Star } from '@react-vant/icons'
import { Button, List, Cell, Dialog, Toast, hooks } from 'react-vant';
import { HistoryItem, convertHistory, favoriteHistory } from './common/storage';
import { noop } from './common/utils'
import WithLoading from '../../components/WithLoading';
import JsonView from '../../../react-json-preview/src/index';

import './History.scss';

const History = () => {
  const [historyList, setHistoryList] = useState<HistoryItem[]>([])
  const [historyLoading, setHistoryLoding] = useState<boolean>(false)

  const [favoriteList, setFavoriteList] = useState<HistoryItem[]>([])
  const [favoriteLoading, setFavoriteLoading] = useState<boolean>(false)

  const loadHistoryList = () => {
    setHistoryLoding(true)
    setTimeout(() => {
      convertHistory.getAll().then((list) => {
        setHistoryList(list)
        setHistoryLoding(false)
      })
    }, 600)
  }

  const loadFavoriteList = () => {
    setFavoriteLoading(true)
    setTimeout(() => {
      favoriteHistory.getAll().then((list) => {
        setFavoriteList(list)
        setFavoriteLoading(false)
      })
    }, 600)
  }

  const handleRefreshClick = () => {
    loadHistoryList()
  }

  hooks.useMount(() => {
    loadHistoryList();
    loadFavoriteList();
  })

  const handleFavoriteClick = (keyItem: HistoryItem, isFavorite: boolean) => {
    if (isFavorite) {
      favoriteHistory.remove(keyItem).then(() => {
        Toast('取消收藏成功！');
        loadFavoriteList();
      });
    } else {
      favoriteHistory.add(keyItem).then(() => {
        Toast('收藏成功！');
        loadFavoriteList();
      }).catch((e) => {
        Toast('收藏失败！');
      });
    }
  }

  const handleRemoveClick = (keyItem: HistoryItem) => {
    Dialog.confirm({
      title: '提示',
      message: `将要删除记录：${keyItem.id}`,
      showCancelButton: true
    }).then(() => {
      convertHistory.remove(keyItem).then(() => {
        Toast('删除成功！');
        loadHistoryList();
      }).catch((e: any) => {
        console.log(e);
        Toast('删除失败！');
      });
    }).catch(noop);
  }

  const renderKeyItem = (keyItem: HistoryItem, key: number | string) => {
    const favoriteIds = favoriteList.map(({ id }) => id)
    const isFavorite = favoriteIds.includes(keyItem.id)

    return (
      <Cell
        key={key}
        extra={
          <>
            {
              isFavorite ? (
                <Star
                  onClick={
                    () => { handleFavoriteClick(keyItem, isFavorite); }
                  }
                  style={{ cursor: 'pointer', marginRight: '5px' }}
                />
              ) : (
                <StarO
                  onClick={
                    () => { handleFavoriteClick(keyItem, isFavorite); }
                  }
                  style={{ cursor: 'pointer', marginRight: '5px' }}
                />
              )
            }
            <DeleteO
              onClick={
                () => { handleRemoveClick(keyItem); }
              }
              style={{ cursor: 'pointer' }}
            />
          </>
        }>
          <JsonView value={keyItem} indent={2} containerHeight={80} />
          <pre className='code'>{JSON.stringify(keyItem, null, 2)}</pre>
        </Cell>
    )
  }

  return (
    <div className='history'>
      <div className="section-operation">
        <Button.Group onClick={noop} block round>
          <Button
            type="primary"
            size="small"
            onClick={handleRefreshClick}
            icon={<Replay />}
          >刷新</Button>
        </Button.Group>
      </div>
      <WithLoading loading={historyLoading}>
        <List className="section-list" finished={true} loading={historyLoading}>
          {
            historyList.map((key) => renderKeyItem(key, key.id))
          }
        </List>
      </WithLoading>
      {/* <pre className='code'>{JSON.stringify(historyList, null, 2)}</pre> */}
    </div>
  )
}

export default History;

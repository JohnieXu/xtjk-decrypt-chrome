import React, { useState, useEffect } from 'react';
import { Replay, DeleteO, StarO, Star } from '@react-vant/icons'
import { Button, List, Cell, Dialog, Toast, hooks } from 'react-vant';
import { HistoryItem, favoriteHistory } from './common/storage';
import { noop } from './common/utils'
import WithLoading from '../../components/WithLoading';

import './Favorite.scss';

const Favorite = () => {
  const [favoriteList, setFavoriteList] = useState<HistoryItem[]>([])
  const [favoriteLoading, setFavoriteLoading] = useState<boolean>(false)

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
    loadFavoriteList();
  };

  hooks.useMount(() => {
    loadFavoriteList();
  });

  const handleRemoveClick = (keyItem: HistoryItem) => {
    Dialog.confirm({
      title: '提示',
      message: `将要删除收藏：${keyItem.id}`,
      showCancelButton: true
    }).then(() => {
      favoriteHistory.remove(keyItem).then(() => {
        Toast('删除成功！');
        loadFavoriteList();
      }).catch((e: any) => {
        console.log(e);
        Toast('删除失败！');
      });
    }).catch(noop);
  }

  const renderKeyItem = (keyItem: HistoryItem, key: number | string) => {
    return (
      <Cell
        key={key}
        extra={
          <>
            <DeleteO
              onClick={
                () => { handleRemoveClick(keyItem); }
              }
              style={{ cursor: 'pointer' }}
            />
          </>
        }>
          <pre className='code'>{JSON.stringify(keyItem, null, 2)}</pre>
        </Cell>
    )
  }

  return (
    <div className='favorite'>
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
      <WithLoading loading={favoriteLoading}>
        <List className="section-list" finished={true} loading={favoriteLoading}>
          {
            favoriteList.map((key) => renderKeyItem(key, key.id))
          }
        </List>
      </WithLoading>
    </div>
  )
}

export default Favorite;

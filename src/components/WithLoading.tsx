import React from 'react';
import { Flex, Loading } from 'react-vant';

interface Props {
  loading?: boolean,
  children?: React.ReactNode
}

const WithLoading = ({ loading, children }: Props) => {
  return (
    <div className="x-with-loading">
      {
        loading ? (
          <Flex justify="center" align="center" style={{ marginTop: '200px' }}>
            <Flex.Item flex="0 0 30px">
              <Loading type="spinner" />
            </Flex.Item>
          </Flex>
        ) : (
          children ? children : null
        )
      }
    </div>
  )
};

export default WithLoading;

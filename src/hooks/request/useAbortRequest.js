import { useEffect, useState } from "react";

/**
 *
 * @param {查询参数} query
 * @param {请求方法} requestData
 * @returns
 * hooks作用: 丢弃一些无效的请求结果
 */
function useAbortRequest(query, requestData) {
  const [ result, setResult ] = useState('');

  useEffect(() => {
    // 有效标识符
    let didCancel = false;
    const fetchData = async () => {
      const response = await requestData(query);
      // 更新数据前判断有效性
      if(!didCancel) {
        setResult(response);
      }
    }

    fetchData();
    return () => {
      didCancel = true;
    }
  }, [ query, requestData ]);

  return result;
}

export default useAbortRequest;
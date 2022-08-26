import { useEffect, useState } from "react";

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
/*
  像搜索框这种场景，需要在用户边输入的时候边提示搜索建议，
  这就需要短时间内发送多个请求，而且前面发出的请求结果不能覆盖后面的（网络阻塞可能导致先发出的请求后返回）。
  可以通过下面这种方式实现过期需求的淘汰。
  (虽然搜索框已经使用像防抖这样的技术，但是防抖的时间限制不能太长，否则就会影响用户的体验)
*/
import { useEffect, useRef, useState } from "react";

/**
 *
 * @param {查询的关键字} query
 * @param {请求数据的函数} requestData
 * @returns {返回的是请求到的数据}
 * hooks作用: 短时间内发送多个请求时，避免前面发出的请求结果覆盖后面的请求结果
 */
// function useWeekoutRequest(query, requestData) {
//   const [ result, setResult ] = useState('');
//   const sequenceId = useRef(0);
//   const lastId = useRef(0);

//   useEffect(() => {
//     const fetchData = async () => {
//       // 发起一个请求时，序号加 1
//       const curId = ++sequenceId.current;
//       const response = await requestData(query);
//       // 只展示序号比上一个有效序号大的数据
//       if(curId > lastId.current) {
//         setResult(response);
//         lastId.current = curId;
//       }
//     }

//     fetchData();
//   }, [query, requestData]);

//   return result;
// }

// export default useWeekoutRequest;

function wrapperfn() {
  let sequenceId = 0;
  let lastId = 0;

  return function useWeekoutRequest(query, requestData) {
    const [ result, setResult ] = useState('');

    useEffect(() => {
      const fetchData = async () => {
        // 发起一个请求时，序号加 1
        const curId = ++sequenceId;
        const response = await requestData(query);
        // 只展示序号比上一个有效序号大的数据
        if(curId > lastId) {
          setResult(response);
          lastId = curId;
        }
      }

      fetchData();
    }, [ query, requestData ]);

    return result;
  }
}
const useWeekoutRequest = wrapperfn();
export default useWeekoutRequest;
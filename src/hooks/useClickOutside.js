/*
  本hooks用于封装点击到目标dom节点以外时的操作逻辑，
*/
import { useEffect } from 'react';

/**
 *
 * @param { {current: value} } ref
 * @param { (e) => void } handler   事件处理函数
 */
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // ref.current.contains(event.target)表示触发该事件的是目标元素的子元素
      if(!ref.current || ref.current.contains(event.target)) {
        return;
      }
      // 当在目标元素以外触发点击操作，就执行handler回调
      handler(event);
    }
    document.addEventListener('click', listener);

    return () => {
      document.addEventListener('click', listener);
    }
  }, [ref, handler])
}

export default useClickOutside;
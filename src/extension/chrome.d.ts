
// Type definitions for Chrome extension API
declare namespace chrome {
  namespace runtime {
    const onInstalled: {
      addListener(callback: () => void): void;
    };
    const onMessage: {
      addListener(
        callback: (
          message: any,
          sender: { tab?: { url: string } },
          sendResponse: (response?: any) => void
        ) => boolean | void
      ): void;
    };
    function sendMessage(message: any, callback?: (response: any) => void): void;
  }
  
  namespace storage {
    namespace sync {
      function get(keys: string | string[] | object | null, callback: (items: { [key: string]: any }) => void): void;
      function set(items: object, callback?: () => void): void;
    }
    
    // Add the onChanged event
    const onChanged: {
      addListener(callback: (changes: { [key: string]: { oldValue?: any; newValue?: any } }, areaName: string) => void): void;
    };
  }
  
  namespace notifications {
    function create(options: any): void;
  }
}

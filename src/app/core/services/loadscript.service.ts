import { Injectable } from '@angular/core';

// https://stackoverflow.com/questions/49501784/angular-5-how-to-import-javascript-specifically-for-this-component-should-not

@Injectable()
export class LoadScriptService {
  removeScript(path: string) {
    // TODO: Remove DOM element that has attribute `data-path="${path}"`
    console.log(document.querySelector(`[data-path='${path}']`));
    document.querySelector(`[data-path='${path}']`).remove();
  }

  loadScript(path: string): Promise<any> {
    return new Promise(resolve => {
      const script: any = document.createElement('script');
      script.type = 'text/javascript';
      script.src = path;
      script.setAttribute('data-path', path);

      // IE
      if (script.readyState) {
        script.onreadystatechange = () => {
          if (script.readyState === 'loaded' || script.readyState === 'complete') {
            script.onreadystatechange = null;
            resolve({ loaded: true, status: 'Loaded' });
          }
        };
      } else {
        script.onload = () => {
          resolve({ loaded: true, status: 'Loaded' });
        };
      }

      script.onerror = (error: any) => resolve({ loaded: false, status: 'Loaded' });
      document.getElementsByTagName('head')[0].appendChild(script);
    });
  }
}

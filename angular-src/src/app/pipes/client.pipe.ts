import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'client'
})
export class ClientPipe implements PipeTransform {

  transform(items: any[], clientText: string): any[] {
    if(!items) return [];
    if(!clientText) return items;
clientText = clientText.toLowerCase();
return items.filter( it => {
      return it.Name.toLowerCase().includes(clientText);
    });
   }
}

import { NgModule, RendererFactoryV2 } from '@angular/core';
import { TransferState } from './transfer-state';
import { PlatformState } from '@angular/platform-server';

export function getTransferState(): TransferState {
  const transferState = new TransferState();
  transferState.initialize(window['TRANSFER_STATE'] || {});
  return transferState;
}

@NgModule({
  providers: [
    {
      provide: TransferState,
      useFactory: getTransferState
    }
  ]
})
export class BrowserTransferStateModule {

}

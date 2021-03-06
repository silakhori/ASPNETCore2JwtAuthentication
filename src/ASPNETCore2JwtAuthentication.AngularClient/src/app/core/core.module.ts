﻿import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from "@angular/core";
import { RouterModule } from "@angular/router";

import { HeaderComponent } from "./component/header/header.component";
import { ApiConfigService } from "./services/api-config.service";
import { APP_CONFIG, AppConfig } from "./services/app.config";
import { AuthGuard } from "./services/auth.guard";
import { AuthInterceptor } from "./services/auth.interceptor";
import { AuthService } from "./services/auth.service";
import { BrowserStorageService } from "./services/browser-storage.service";
import { RefreshTokenService } from "./services/refresh-token.service";
import { TokenStoreService } from "./services/token-store.service";
import { UtilsService } from "./services/utils.service";
import { XsrfInterceptor } from "./services/xsrf.interceptor";

@NgModule({
  imports: [CommonModule, RouterModule],
  exports: [
    // components that are used in app.component.ts will be listed here.
    HeaderComponent
  ],
  declarations: [
    // components that are used in app.component.ts will be listed here.
    HeaderComponent
  ],
  providers: [
    // global singleton services of the whole app will be listed here.
    UtilsService,
    BrowserStorageService,
    TokenStoreService,
    RefreshTokenService,
    {
      provide: APP_CONFIG,
      useValue: AppConfig
    },
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: XsrfInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    ApiConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: (config: ApiConfigService) => () => config.loadApiConfig(),
      deps: [ApiConfigService],
      multi: true
    },
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if (core) {
      throw new Error("CoreModule should be imported ONLY in AppModule.");
    }
  }
}

// import path from 'path';

// import { AcceptLanguageResolver, HeaderResolver, I18nOptions, QueryResolver } from 'nestjs-i18n';

// export const ACCEPT_LANGUAGE = 'accept-language';
// export const CURRENT_LANGUAGE = 'CURRENT_LANGUAGE'
// export const AcceptLanguage = {
//     'en-Us': 'en-US',
//     'ar-SY': 'ar-SY'
// }

// export type AcceptLanguage = (typeof AcceptLanguage)[keyof typeof AcceptLanguage];

// export const i18nOptions: I18nOptions = {
//     fallbackLanguage: AcceptLanguage['en-Us'],
//     loaderOptions: {
//         path: path.join(process.cwd(), 'static/i18n'),
//         watch: true
//     },
//     typesOutputPath: path.join(process.cwd(), 'libs/common/generated/i18n.generated.ts'),
//     viewEngine: undefined,
//     throwOnMissingKey: true,
//     logging: true,// dep on env
//     resolvers: [
//         {
//             use: QueryResolver, options: ['lang']
//         },
//         AcceptLanguageResolver,
//         new HeaderResolver([ACCEPT_LANGUAGE])

//     ]

// }

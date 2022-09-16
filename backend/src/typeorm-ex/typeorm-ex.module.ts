// import { DynamicModule, Provider } from '@nestjs/common';
// import { getDataSourceToken } from '@nestjs/typeorm';
// import { DataSource } from 'typeorm';
// import { TYPEORM_EX_CUSTOM_REPOSITORY } from './typeorm-ex.decorator';

// export class TypeOrmExModule {
//   // ... => 가변인자
//   public static forCustomRepository<T extends new (...args: any[]) => any>(
//     repositories: T[],
//   ): DynamicModule {
//     const providers: Provider[] = [];

//     for (const repository of repositories) {
//       // Reflect는 metadata를 인터셉트 하는 느낌으로 생각하면 됨
//       const entity = Reflect.getMetadata(
//         TYPEORM_EX_CUSTOM_REPOSITORY,
//         repository,
//       );

//       if (!entity) {
//         continue;
//       }

//       providers.push({
//         inject: [getDataSourceToken()], // DB 데이터 연결
//         provide: repository,
//         // 공급자를 동적으로 생성
//         useFactory: (dataSource: DataSource): typeof repository => {
//           const baseRepository = dataSource.getRepository<any>(entity);
//           return new repository(
//             baseRepository.target,
//             baseRepository.manager,
//             baseRepository.queryRunner,
//           ); //생성자 반환
//         },
//       });
//     }

//     return {
//       exports: providers,
//       module: TypeOrmExModule,
//       providers,
//     };
//   }
// }

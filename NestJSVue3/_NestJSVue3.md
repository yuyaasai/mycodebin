
# 前提条件
```sh
# NestJS CLI のグローバルインストール
npm i -g @nestjs/cli
# Vue CLI のグローバルインストール
npm i -g @vue
```

※これnpxじゃあかんの？

# プロジェクトの作成
```
mkdir NestJSVue3
cd NestJSVue3
nest new backend
cd backend
npx rimraf .git # mycodebin のサブディレクトリに配置しているので .git を削除
npm ci

cd ..
vue create frontend
cd frontend
npm i axios --save-exact
```

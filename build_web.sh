source ~/.bash_profile

# 子项目依赖编译
yarn install --scope=@pagenote/obsidian
yarn workspace @pagenote/obsidian run build

# 项目编译
yarn install --scope=pagenote-web
yarn workspace pagenote-web run build

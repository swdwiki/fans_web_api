const expType = {
  SIGN_IN: {
    value: 0,
    exp: 10,
    label: '每日签到',
  },
  //   文章
  POST_PUSH: {
    value: 1,
    exp: 20,
    label: '发布文章',
    type: 'add',
    times: 5,
  },
  POST_PUBLISHED: {
    value: 2,
    exp: 10,
    label: '文章上架',
    type: 'add',
  },
  POST_UNPUBLISHED: {
    value: 3,
    exp: 10,
    label: '文章下架',
    type: 'lower',
  },
  POST_DELETED: {
    value: 4,
    exp: 20,
    label: '文章被删除',
    type: 'lower',
  },
  //   同人作品
  WORK_PUSH: {
    value: 5,
    exp: 50,
    label: '发布同人作品',
    type: 'add',
  },
  WORK_PUBLISHED: {
    value: 6,
    exp: 25,
    label: '同人作品上架',
    type: 'add',
  },
  WORK_UNPUBLISHED: {
    value: 7,
    exp: 25,
    label: '同人作品下架',
    type: 'lower',
  },
  WORK_DELETED: {
    value: 8,
    exp: 50,
    label: '同人作品被删除',
    type: 'lower',
  },
  //   尺牍
  STICK_PUSH: {
    value: 9,
    exp: 10,
    label: '发布尺牍',
    type: 'add',
    times: 10,
  },
  STICK_DELETED: {
    value: 10,
    exp: 10,
    label: '尺牍被删除',
    type: 'lower',
  },
  //   同人游戏
  GAME_PUSH: {
    value: 11,
    exp: 100,
    label: '发布同人游戏',
    type: 'add',
  },
  GAME_PUBLISHED: {
    value: 12,
    exp: 25,
    label: '同人游戏上架',
    type: 'add',
  },
  GAME_UNPUBLISHED: {
    value: 13,
    exp: 25,
    label: '同人游戏下架',
    type: 'lower',
  },
  GAME_DELETED: {
    value: 14,
    exp: 50,
    label: '同人游戏被删除',
    type: 'lower',
  },
  //

  //   POST_FIRST_PUSH: {
  //     value: 2,
  //     exp: 200,
  //     label: '首次发布文章',
  //     type: 'add',
  //   },
  // WORK_FIRST_PUSH: {
  //     value: 6,
  //     exp: 500,
  //     label: '首次发布同人作品',
  //     type: 'add',
  //   },
  //   STICK_FIRST_PUSH: {
  //     value: 10,
  //     exp: 100,
  //     label: '首次发布尺牍',
  //     type: 'lower',
  //   },
};

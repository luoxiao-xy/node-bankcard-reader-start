import {
  DTypes as W,
  FModel as FM,
} from 'win32-def'

import {
  Config,
} from './model'


export {
  initialOpts,
} from '@waiting/bankcard-reader-base'

export const config: Config = {
  appDir: '',
}

export const dllFuncs: FM.DllFuncs = {
  star_InitConnect: [W.INT, [W.INT, W.INT, W.CHAR, W.CHAR, W.INT] ],   // 初始化设备
  star_Open: [W.INT, [W.INT, W.INT, W.CHAR] ], // 初始化设备打开端口
  star_Close: [W.INT, [] ], // 关闭端口
  star_GetDevInfo: [W.INT, [W.PSTR, W.LPINT] ], // 获取设备信息
  star_ICGetInfo: [W.INT, [W.INT, W.PSTR, W.PSTR, W.INT] ], // IC卡读取
  star_ReadMagCardNo: [W.INT, [W.INT, W.INT, W.PSTR, W.LPINT, W.INT] ], // 磁条卡读取
}

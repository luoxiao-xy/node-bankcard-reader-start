import {
  BankCardData,
  Config,
  Device as DeviceBase,
  Options,
} from '@waiting/bankcard-reader-base'
import {
  DModel as M,
  FModel as FM,
} from 'win32-def'


export {
  BankCardData,
  Config,
  Options,
}


/** dll接口方法 */
export interface DllFuncsModel extends FM.DllFuncsModel {
  star_InitConnect(iPort: M.INT, iBaud: M.INT, cBp: M.CHAR, szDevInfo: M.POINT, iInfoLen: M.POINT): M.INT   // 初始化设备
  star_Open(iPort: M.INT, iBaud: M.INT, cBp: M.CHAR): M.INT // 初始化设备打开端口
  star_Close(): M.INT // 关闭端口
  star_GetDevInfo(szDevInfo: M.POINT, iInfoLen: M.POINT): M.INT // 获取设备信息
  star_ICGetInfo(iIcMode: M.INT, szTagList: M.POINT, szCardInfo: M.POINT, iTimeout: M.INT): M.INT  // IC卡读取
  star_ReadMagCardNo(
    iReadTrack: M.INT,
    iDataType: M.INT,
    szCardNo: M.POINT,
    iCardNoLen: M.POINT,
    iTimeout: M.INT,
    ): M.INT  // 磁条卡读取
}

/** 读卡设置 */
export interface Device extends DeviceBase {
  apib: DllFuncsModel
}

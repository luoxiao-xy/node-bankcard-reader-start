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
  JC_GetBankNumber(bankNum: M.POINT): M.INT // 接触获取银行卡卡号
  FJ_GetBankNumber(bankNum: M.POINT): M.INT // 非接获取银行卡卡号
}

export interface Kernel32Model extends FM.DllFuncsModel {
  SetDllDirectoryW(lpPathName: M.LPCTSTR): M.BOOLEAN
  GetDllDirectoryW(nBufferLength: M.DWORD, lpBuffer: M.LPTSTR): M.DWORD
}

/** 读卡设置 */
export interface Device extends DeviceBase {
  apib: DllFuncsModel
}

import JSEncrypt from 'jsencrypt'

//公钥
var publicKey =
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDp92e+IOQiS+/dhOBlbI/o90RCaziV1dX/uKBQcu8PYBpwc3EJFRJacJQ1hCDZGjumJKBVWbyy3pxal9dXqhpN6M46xS/ma0YvOrmPBOjRQqizuUgL2zzJrDAnXC+B2TznGrzSEx7tUD3yJPVR5TwP0awKIzHDLyeA+jWUc5wi4QIDAQAB'
const encryption = (content) => {
    let jse = new JSEncrypt()
    jse.setPublicKey(publicKey)
    var str = jse.encrypt(content)
    return str
}

export default encryption

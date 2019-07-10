const test1 = () => {
  try{
    test3()
  } catch(error) {
    console.log('error1')
  }
}
const test2 = async () => {
  try{
    await test4()
  } catch(error) {
    console.log('error2')
  }
}
const test3 = () => {
  setTimeout(() => {
    throw new Error('error3')
  },1000)
}
const test4 = () => {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('error4'))
    }, 1000)
  })
  return promise
}
// test1()
test2()
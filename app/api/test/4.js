const test1 = () => {
  try{
    test3()
  } catch(error) {
    console.log('error')
  }
}
const test2 = async () => {
  try{
    await test4()
  } catch(error) {
    console.log('error')
  }
}
const test3 = () => {
  setTimeout(() => {
    throw new Error('error')
  },1000)
}
const test4 = () => {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('error'))
    }, 1000)
  })
  return promise
}
// test1()
test2()
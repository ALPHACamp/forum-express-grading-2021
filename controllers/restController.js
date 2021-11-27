//在這個例子裡，restController 是 controller 的名稱，
//而 getRestaurants 則是 controller 裡的一個 action。
//如果把程序抽取到 controller 裡，
//就需要在原本的路由去呼叫特定的 controller action。
const restController = {
  //getRestaurants 這個屬性的值是一個 function，而這個 function 負責「瀏覽餐廳頁面」
  //，也就是去 render 一個叫做 restaurants 的樣板
  getRestaurants: (req, res) => {
    return res.render('restaurants')
  }
}
//export出去之後才能在其他檔案裡使用
//將相關的view做好之後，就可以到路由裡引入restController
module.exports = restController
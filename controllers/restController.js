//在這個例子裡，restController 是 controller 的名稱，
//而 getRestaurants 則是 controller 裡的一個 action。
const restController = {
  //getRestaurants 這個屬性的值是一個 function，而這個 function 負責「瀏覽餐廳頁面」
  //，也就是去 render 一個叫做 restaurants 的樣板
  getRestaurants: (req, res) => {
    return res.render('restaurants')
  }
}
module.exports = restController
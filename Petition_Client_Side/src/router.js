import VueRouter from 'vue-router'
import Petitions from "./components/Petitions.vue"
import Home from "./components/Home.vue"
import Register from "./components/Register.vue"
import NavBar from "./components/NavBar"
import Petition from "./components/Petition"
import Profile from "./components/Profile"
import Login from "./components/Login"
import CreatePetition from "./components/CreatePetition";
import EditPetition from "./components/EditPetition";
import EditProfile from "./components/EditProfile";


const routes = [
  {path: "/", name: "home", component: Home},
  {path: "/Petitions", name: "petitions", component: Petitions},
  {path: "/Register", name: "register", component: Register},
  {path: "/NavBar", name: "navBar", component: NavBar},
  {path: "/Petition/petitionId", name: "petition", component: Petition},
  {path: "/Profile", name: "profile", component: Profile},
  {path: "/Login", name: "login", component: Login},
  {path: "/CreatePetition", name: "createPetition", component: CreatePetition},
  {path: "/EditPetition", name: "editPetition", component: EditPetition},
  {path: "/EditProfile/userId", name: "editProfile", component: EditProfile}
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router;

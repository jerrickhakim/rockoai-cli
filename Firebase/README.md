Next.js + Firebase SaaS Starter Kit

---

This started kit was inspired by productions app. Simplicity at scale.

## Importing Firebase on client

```
import {storage, db, auth} from "@/firebase/client"
```

## Importing Firebase on server

```
import {db, auth} from "@/server/firebase"

Get firebase user on the server
import {getCurrentUser} from "@/server/auth"
const user = await getCurrentUser();
```

## Build in helper hooks

```
// Returns firebase user object
import { useUser } from "@/stores/userStore";
const user = useUser()

```

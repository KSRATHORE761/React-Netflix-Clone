import React from 'react';
import './PlansScreen.css';
import { useState } from 'react';
import { useEffect } from 'react';
import db from '../Firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { loadStripe } from '@stripe/stripe-js';

function PlansScreen() {
    const[products,setProducts] = useState([]);
    const user = useSelector(selectUser);
    const[subscription,setSubscription] = useState(null);

    useEffect(()=>{
        db.collection('customers')
        .doc(user.uid)
        .collection("subscriptions")
        .get()
        .then(querySnapshot =>{
            querySnapshot.forEach(async subscription=>{
                setSubscription({
                    role:subscription.data().role,
                    current_period_end : subscription.data().current_period_end.seconds,
                    current_period_start:subscription.data().current_period_start.seconds
                })
            })
        })
    },[user.uid])
    console.log(subscription);
    useEffect(()=>{
        db.collection('products').where('active','==',true).get()
        .then(querySnapshot =>{
            const products={};
            querySnapshot.forEach(async productDoc=>{
                products[productDoc.id] = productDoc.data();
                const pricesSnap = await productDoc.ref.collection("prices").get();
                pricesSnap.docs.forEach(price=>{
                    products[productDoc.id].prices ={
                        priceId:price.id,
                        priceData:price.data()
                    } 
                });
            });
            setProducts(products);
        });
    },[])

    const loadCheckOut = async(priceId) =>{
        const docRef = await db.collection('customers')
        .doc(user.uid)
        .collection("checkout_sessions")
        .add({
            price:priceId,
            success_url:window.location.origin,
            cancel_url:window.location.origin,
        });

        docRef.onSnapshot(async(snap)=>{
            const{error,sessionId} = snap.data();
            if(error){
                //show an error to your customer and
                //inspect your cloud function logs in the firebase console.
                alert(`An error occured: ${error.message}`);
            }
            if(sessionId){
                //We have a session,let's redirect to checkout
                //Init Stripe
                const stripe = await loadStripe("pk_test_51Mxso4SG0pueecwkdHYliogw9eIMmL635pcm7Ee7bTNatsWvXH7wJOHNQrO5yHZtNzpiyDYXrLPoBtL3DWU1q9Zz00CP3jxwB8");
                stripe.redirectToCheckout({sessionId});

            }
        })

    }

  return (
    <div className="plansScreen">
        {subscription && <p>Renewal Date: {new Date(subscription?.current_period_end * 1000).toLocaleDateString()}</p>}
        {Object.entries(products).map(([productId,productData])=>{
            //add some logic to check if user's subscription is active...
            const isCurrentPackage = productData.name?.toLowerCase().includes(subscription?.role);
      
            return (
                <div key={productId} className={`${isCurrentPackage && "plansScreen__plan-disabled"} plansScreen__plan`}>
                    <div className="planScreen__info">
                        <h4>{productData.name}</h4>
                        <h5>{productData.description}</h5>
                    </div>
                    <button onClick={()=> !isCurrentPackage && loadCheckOut(productData.prices.priceId)}>
                        {isCurrentPackage ? 'Current Pacakge' : 'Subscribe'}
                    </button>
                </div>
            )
        })}
    </div>
  )
}

export default PlansScreen
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDocs, collection } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDUGqIWF8HuSA_5vVZ_pnP2YlgDXd1Q8Wo",
  authDomain: "lappy-square.firebaseapp.com",
  projectId: "lappy-square",
  storageBucket: "lappy-square.firebasestorage.app",
  messagingSenderId: "353569640524",
  appId: "1:353569640524:web:4e8c0215320d5ecab024e9",
  measurementId: "G-B9SHC5R303"
};

async function testFirestore() {
  console.log('Testing Firestore Connection to project "lappy-square"...');
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const testRef = doc(db, 'system_test', 'connection_check');
  await setDoc(testRef, {
    status: 'connected',
    appName: 'Lappy Square',
    timestamp: new Date().toISOString(),
  });
  console.log('✅ Successfully wrote test doc to Firestore collection "system_test"!');

  const snapshot = await getDocs(collection(db, 'system_test'));
  console.log(`✅ Read ${snapshot.docs.length} docs from "system_test" successfully!`);
  console.log('Firestore is 100% operational and linked!');
}

testFirestore().catch((err) => {
  console.error('❌ Firestore connection error:', err);
  process.exit(1);
});

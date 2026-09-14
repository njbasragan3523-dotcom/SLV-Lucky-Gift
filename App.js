import React, {useState} from "react";
import {SafeAreaView,ScrollView,View,Text,TextInput,Pressable,StyleSheet,Alert} from "react-native";
import {createClient} from "@supabase/supabase-js";

const SUPABASE_URL="https://hncmbozlsviddzhfyhqr.supabase.co";
const SUPABASE_KEY="PASTE_PUBLISHABLE_KEY_HERE";
const sb=createClient(SUPABASE_URL,SUPABASE_KEY);

export default function App(){
 const [name,setName]=useState(""),[phone,setPhone]=useState(""),[billNo,setBillNo]=useState(""),[amount,setAmount]=useState("");
 const [message,setMessage]=useState("");
 const spins=Number(amount)>=50000?3:Number(amount)>=25000?2:Number(amount)>=10000?1:0;

 async function save(){
  if(!name||!phone||!billNo||Number(amount)<10000){Alert.alert("సమాచారం","అన్ని వివరాలు సరిగ్గా నమోదు చేయండి.");return;}
  if(SUPABASE_KEY.startsWith("PASTE_")){Alert.alert("సెటప్","Supabase కీని నిర్మాణ సమయంలో జోడించాలి.");return;}
  const {data:c,error:e1}=await sb.from("customers").upsert({name,phone},{onConflict:"phone"}).select().single();
  if(e1){Alert.alert("లోపం",e1.message);return;}
  const {error:e2}=await sb.from("purchases").insert({
    customer_id:c.id,bill_number:billNo,amount:Number(amount),bill_amount:Number(amount),product_type:"CEMENT+STEEL"
  });
  if(e2){Alert.alert("లోపం",e2.message);return;}
  setMessage("బిల్ విజయవంతంగా నమోదు అయింది. అడ్మిన్ ఆమోదం తర్వాత "+spins+" స్పిన్ అందుబాటులో ఉంటుంది.");
 }
 return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.wrap}>
  <Text style={s.title}>SLV Lucky Gift</Text>
  <Text style={s.shop}>SREE LAKSHMI VENKATESWARA TRADERS</Text>
  <View style={s.card}><Text style={s.h}>బిల్ నమోదు</Text>
   <TextInput style={s.input} placeholder="కస్టమర్ పేరు" value={name} onChangeText={setName}/>
   <TextInput style={s.input} placeholder="ఫోన్ నంబర్" keyboardType="phone-pad" value={phone} onChangeText={setPhone}/>
   <TextInput style={s.input} placeholder="బిల్ నంబర్" value={billNo} onChangeText={setBillNo}/>
   <TextInput style={s.input} placeholder="బిల్ మొత్తం ₹" keyboardType="numeric" value={amount} onChangeText={setAmount}/>
   <Text style={s.spins}>అర్హత: {spins} స్పిన్</Text>
   <Pressable style={s.btn} onPress={save}><Text style={s.btnText}>బిల్ నమోదు చేయండి</Text></Pressable>
   {!!message&&<Text style={s.msg}>{message}</Text>}
  </View>
  <View style={s.card}><Text style={s.h}>లక్కీ వీల్</Text><View style={s.wheel}><Text style={{fontSize:52}}>🎁</Text></View>
   <Text style={s.note}>అడ్మిన్ బిల్ ఆమోదించిన తర్వాత సర్వర్ ద్వారా అసలు బహుమతి ఎంపిక అవుతుంది.</Text>
  </View>
 </ScrollView></SafeAreaView>
}
const s=StyleSheet.create({
safe:{flex:1,backgroundColor:"#f4f4f4"},wrap:{padding:18},title:{fontSize:30,fontWeight:"800",textAlign:"center"},
shop:{textAlign:"center",fontWeight:"700",marginBottom:18},card:{backgroundColor:"#fff",padding:18,borderRadius:16,marginBottom:16},
h:{fontSize:21,fontWeight:"800",marginBottom:12},input:{borderWidth:1,borderColor:"#ccc",borderRadius:10,padding:13,marginBottom:10},
spins:{fontSize:17,fontWeight:"700",marginBottom:12},btn:{backgroundColor:"#111",padding:15,borderRadius:10,alignItems:"center"},
btnText:{color:"#fff",fontSize:17,fontWeight:"800"},msg:{marginTop:12,fontSize:16},wheel:{height:180,width:180,borderRadius:90,borderWidth:8,alignSelf:"center",alignItems:"center",justifyContent:"center"},
note:{textAlign:"center",marginTop:14,fontSize:15}
});
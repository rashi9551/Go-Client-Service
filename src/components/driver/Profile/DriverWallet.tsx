/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Card,
    CardHeader,
    Typography,
    CardBody,
    Chip,
    Dialog,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import axiosDriver from '../../../service/axios/axiosDriver';
import { useSelector } from "react-redux";
import {toast} from 'sonner' ;
import { DriverInterface, Transaction } from "../../../utils/interfaces";
import moment from 'moment'

const DriverWallet = () => {
    const TABLE_HEAD = ["No", "Date", "Details", "Status", "Amount"];

    const [driverData, setdriverData] = useState<DriverInterface>()
    const [walletTransactions, setwalletTransactions] = useState<Transaction[]>([])

    const {driverId} = useSelector((store: {driver:{driverId:string}}) => store.driver)

    
    const getData = async () => {
        try {
            const { data } = await axiosDriver().get(`driverData?driver_id=${driverId}`)
            setdriverData(data)
            setwalletTransactions(data.formattedTransactions)
        } catch (error) {
            toast.error((error as Error).message)
            console.log(error);
        }
    }
    const [paymentModal, setpaymentModal] = useState(false)
    const [balance, setbalance] = useState("")
    const [upiId, setUpiId] = useState('');


    const RedeemWallet=async()=>{
        try {
            setpaymentModal(false)
            console.log(balance,upiId,"=--");
            console.log(driverData?.wallet?.balance,"=-=-=-=");
            const currentWalletBalance = (driverData?.wallet?.balance??5000)
            if(Number(balance)<500){
                toast.info("Enter 500 ore more")
                return
            }else if(Number(balance)>currentWalletBalance){
                toast.info("your balance is less that wallet")
                return
            }else{
                const {data} = await axiosDriver().post(`redeemWallet?driver_id=${driverId}`,{balance,upiId})
                if(data.message==="Success"){
                    toast.success("Wallet Redeemed Succesfully")
                    getData()
                }else{
                    toast.error("something happened in payout")
                }

            }
            
        } catch (error) {
            console.log(error);
            
        }
        
    }
    
    useEffect(() => {
        getData()
    }, [])

    return (
        <>
        <Dialog className='bg-transparent' open={paymentModal} handler={RedeemWallet} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                {paymentModal &&
                    <>
                    <div className="w-full h-fit rounded-lg bg-white shadow-lg px-8 pt-8 flex flex-col text-center">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                                Enter The Amount you Want To Redeem To Your Account
                            </h1>
                        </div>
                        <div className="mt-4 text-center w-full">
                            <input
                                type="number"
                                onChange={(e) => setbalance(e.target.value)}
                                placeholder="Type here"
                                className="input input-bordered input-success w-full max-w-xs mx-auto rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                            />
                        </div>
                        <div className="mt-4 text-center w-full">
                            <input
                                type="text"
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="Enter UPI ID"
                                className="input input-bordered input-success w-full max-w-xs mx-auto rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                            />
                        </div>
                        <div className="flex justify-center items-end h-fit mt-7 mb-7 gap-5">
                            <button
                                onClick={() => setpaymentModal(false)}
                                className="w-[30%] h-12 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition duration-300 shadow-lg">
                                Dismiss
                            </button>
                            <button
                                onClick={() => RedeemWallet()}
                                className="w-[30%] h-12 bg-green-500 text-white font-bold rounded-full hover:bg-green-600 transition duration-300 shadow-lg">
                                Redeem
                            </button>
                        </div>
                    </div>
                </>
                }
            </Dialog>
            <div className='bg-gray-100 w-[96%] mx-auto h-fit rounded-2xl drop-shadow-2xl md:flex'>
                <Card className="h-full - w-full"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <CardHeader floated={false} shadow={false} className="rounded-none"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <div className="mt-2  flex flex-col justify-between gap-8 md:flex-row md:items-center">
                            <div className="flex w-full shrink-0 gap-2 md:w-max">
                                <div className="w-full md:w-72 px-3">
                                     <h1 className="text-2xl font-medium text-black">Wallet transactions</h1>
                                </div>
                            </div>
                           <div className="md:flex grid md:w-fit shrink-0 gap-3 md:gap-2">
                                <div className="w-fit flex">
                                <button className="btn bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full flex items-center space-x-2">
                                    <span>WALLET BALANCE</span>
                                    <div className="badge badge-lg w-[100px] bg-blue-700 text-white p-1 rounded-full">
                                        ₹{driverData?.wallet?.balance}
                                    </div>
                                </button>
                                </div>

                                <div
                                    onClick={() =>  setpaymentModal(true)}
                                    className="w-fit flex">
                                    <button className="btn bg-red-400 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full flex items-center space-x-2">
                                        <span>REDEEM</span>
                                        <div className="badge w-[25px] badge-lg badge-success bg-red-700 text-white p-1 rounded-full">-</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="max-h-96 overflow-y-auto px-0 driver-ride-table"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                        <table className="w-full min-w-max table-auto text-center ">
                            <thead>
                                <tr>
                                    {TABLE_HEAD.map((head) => (
                                        <th
                                            key={head}
                                            className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                                        >
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal leading-none opacity-70"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                            >
                                                {head}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {walletTransactions?.map(
                                    (
                                        {
                                            date,
                                            details,
                                            amount,
                                            status,
                                        }:Transaction,
                                        index,
                                    ):any => {
                                        const isLast = index === walletTransactions?.length - 1;

                                        const classes = isLast
                                            ? "p-4 text-center"
                                            : "p-4 border-b border-blue-gray-50 text-center";

                                        return (
                                            <tr key={index}>
                                                <td className={classes + " w-2"}>
                                                    <div className="flex justify-center gap-3">
                                                        <Typography  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                        >
                                                            {index + 1}
                                                        </Typography>
                                                    </div>
                                                </td>
                                                <td className={classes + " max-w-[15rem]"}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        { moment(date).format("dddd, DD-MM-YYYY")}
                                                    </Typography>
                                                </td>
                                                <td className={classes + " max-w-[15rem]"}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                    >
                                                        {details}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <div className="w-fit  mx-auto">
                                                        <Chip
                                                            size="sm"
                                                            variant="ghost"
                                                            value={status}
                                                            color={
                                                                status === "Credit"
                                                                    ? "green"
                                                                    : status === "Debit"
                                                                        ? "red" : "amber"
                                                            }
                                                        />
                                                    </div>
                                                </td>
                                                <td className={classes}>
                                                    <div className="flex justify-center gap-3">
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal opacity-70"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                                                            >
                                                                ₹{amount}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    },
                                )}
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
            </div>
        </>
    )
}

export default DriverWallet
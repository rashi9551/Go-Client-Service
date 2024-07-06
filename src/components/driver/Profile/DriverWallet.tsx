/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Card,
    CardHeader,
    Typography,
    CardBody,
    Chip,
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
            setwalletTransactions(data.wallet.transactions)
        } catch (error) {
            toast.error((error as Error).message)
            console.log(error);
        }
    }
    
    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            <div className='bg-gray-100 w-[96%] mx-auto h-fit rounded-2xl drop-shadow-2xl md:flex'>
                <Card className="h-full - w-full"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <CardHeader floated={false} shadow={false} className="rounded-none"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <div className="mt-2  flex flex-col justify-between gap-8 md:flex-row md:items-center">
                            <div className="flex w-full shrink-0 gap-2 md:w-max">
                                <div className="w-full md:w-72 px-3">
                                     <h1 className="text-2xl font-medium text-black">Wallet transactions</h1>
                                </div>
                            </div>
                            <div className="flex w-full shrink-0 gap-2 md:w-max">
                                <div className="w-full ">
                                    <button className="btn">
                                        WALLET BALANCE
                                        <div className="badge badge-lg badge-success text-black">₹{driverData?.wallet?.balance}</div>
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
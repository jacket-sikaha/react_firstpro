import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./index.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { http } from "@/utils";
const { Option } = Select;

const Publish = () => {
  const { channelStore } = useStore();
  // useEffect(() => {
  //   channelStore.loadChannelList();
  // }, [channelStore]);

  const [fileList, setfileList] = useState([]);
  const onUploadChange = (info) => {
    // if (info.file.status !== "uploading") {
    //   console.log(info.file, info.fileList);
    // }
    let newList = [...info.fileList];
    if (info.file.status === "done") {
      newList = info.fileList.map((file) => {
        //antd官网范例：统一更新/发布文章操作的数据格式，否则修改文章后上传会报错
        if (file.response) {
          // Component will show file.url as link
          file.url = file.response.data.url;
        }
        return file;
      });
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
    setfileList(newList);
    //暂存列表与fileList数据结构格式要一致，不然切换时会出现问题
    imgList.current.fileList = newList;
  };

  const imgList = useRef([]);

  const [imgCount, setImgCount] = useState(1);
  const radioChange = (radio) => {
    setImgCount(radio.target.value);
    if (radio.target.value === 0 || !imgList.current) {
      setfileList([]);
      return;
    }
    console.log(" ", fileList);

    console.log("radio", imgList.current.fileList);
    // setfileList(imgList.current.fileList);
    if (radio.target.value === 1) {
      setfileList([imgList.current.fileList[0]]);
    }
    if (radio.target.value === 3) {
      setfileList(imgList.current.fileList);
    }
  };

  //编辑功能
  //文案适配  路由参数id  判断条件
  const [params] = useSearchParams();
  const articleId = params.get("id");

  //数据回填  id调用接口  1表单回填 2暂存列表 3upload组件filelist
  const form = useRef(null);
  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`/mp/articles/${articleId}`);
      console.log("data", res);
      let obj = res.data.data;
      form.current.setFieldsValue({
        ...obj,
        type: obj.cover.type,
      });
      let newList = obj.cover.images.map((url) => ({ url }));
      imgList.current.fileList = newList;
      console.log("newList", newList);
      setfileList(newList);
    };
    if (articleId) {
      loadDetail();
    }
  }, [articleId]);

  const navigate = useNavigate();
  const onFinish = async (data) => {
    const res = {
      ...data,
      cover: {
        type: data.type,
        //上传数据统一只认url属性
        images: fileList.map((file) => file.url),
      },
    };
    console.log("data", res);
    if (articleId) {
      // 编辑
      await http.put(`/mp/articles/${articleId}?draft=false`, res);
      message.success(`修改成功`);
    } else {
      // 新增
      await http.post("/mp/articles?draft=false", res);
      message.success(`发布成功`);
    }
    navigate("/article");
  };
  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {articleId ? "修改文章" : "发布文章"}
            </Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        {/* initialValues为富文本编辑器设置初始值，否则会报错 */}
        <Form
          ref={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1, content: "" }}
          onFinish={onFinish}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入文章标题" }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: "请选择文章频道" }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channelStore.channelList.map((value) => (
                <Option key={value.id} value={value.id}>
                  {value.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={radioChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imgCount > 0 && (
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList
                action="http://geek.itheima.net/v1_0/upload"
                fileList={fileList}
                onChange={onUploadChange}
                multiple={imgCount > 1}
                maxCount={imgCount}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: "请输入文章内容" }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {articleId ? "修改文章" : "发布文章"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default observer(Publish);
